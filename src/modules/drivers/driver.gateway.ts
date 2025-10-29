import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DriverResponse } from "./dto/response-dto/driverResponse.dto";
import { OrdersService } from "../orders/orders.service";
import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CustomerGateway } from "../customers/customer.gateway";
import { SendOrderRequestDto } from "../orders/dto/sendOrderRequest.dto";
import { calculateDistance } from "src/shared/utils/haversineFormulaFuncion";
import { DriversService } from "./drivers.service";
import { geohashEncode } from "src/shared/utils/geohashFunctions";
//general driver's location and his geoHash
import { geohashDrivers, driverGeohash, driverNowLocation } from 'src/common/providers/global-cache/globalCache.provider';
import { InjectRepository } from "@nestjs/typeorm";
import { ProcessingOrder } from "../processing-orders/entities/processing-order.entity";
import { Repository } from "typeorm";
import { I18n } from "nestjs-i18n";
import { I18nKeys } from "src/common/i18n/i18n-keys";
import { stringify } from "querystring";



@WebSocketGateway({namespace:'drivers',cors:{origin:'*',credentials:true}})
@Injectable()
export class DriverGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  //------------------must use here Redis------------------

  private driverResponses: Map<string, (response: DriverResponse) => void>;
  private driverSockets: Map<number, string>; //Map<driverId, socketId>
  //we take snapshot every 1 minute
  //we update distance in DB every 5 minute
  private ordersLastSnapshots: Map<number, [[number, number], number]>;  //Map<orderId, [pos:[lat,lng], time in seconds]>
  private ordersCurrent: Map<number, [number, number]>;   //Map<orderId, [currentDistance, currentTime in seconds]>
  private ordersTime: Map<number, number>; //Map<orderId, time in seconds>
  //general timer to update driver location and geohash while he is not working
  private timer: number;
  
  constructor(
    private readonly customerGateway:CustomerGateway,
    @InjectRepository(ProcessingOrder) private readonly processingOrderRepository: Repository<ProcessingOrder>,
  ){
    this.driverResponses = new Map();
    this.driverSockets = new Map();
    this.ordersLastSnapshots = new Map();
    this.ordersCurrent = new Map();
    this.ordersTime = new Map();
    this.timer=0;
  }


  handleConnection(client: Socket) {
    const driverId = client.handshake.auth.driverId;
    if (driverId) {
      this.driverSockets.set(Number(driverId), client.id);
      client.join(`driver-${driverId}`);
      console.log(`Driver ${driverId} connected`);
    } else {
      console.log('Driver connection missing driverId');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
  const driverId = [...this.driverSockets.entries()]
    .find(([_, socketId]) => socketId === client.id)?.[0];

  if (driverId !== undefined) {
    this.driverSockets.delete(driverId);
    console.log(`Driver ${driverId} disconnected`);
  }
  }

  sendOrderRequest(driverId:number,sendOrderRequestDto:SendOrderRequestDto) {
    // Emit from server to driver
    console.log('request to driver');
    const socketId=this.driverSockets.get(driverId)!
    this.server.to(socketId).emit('order-request', sendOrderRequestDto);
  }

  cancelOrderRequest(driverId:number,orderId:number) {
    // Emit from server to driver
    console.log('cancel order request');
    const socketId=this.driverSockets.get(driverId)!
    this.server.to(socketId).emit('cancel-order-request', orderId);
  }

  @SubscribeMessage('order-response')
  handleDriverResponse(@MessageBody() data: DriverResponse) {
    // Listen to driver's response
    console.log('orderResponse',data);
    const key = `${data.orderId}`;
    const resolver = this.driverResponses.get(key);
    if (resolver) {
      resolver(data); // resolve the waiting promise
      this.driverResponses.delete(key);
    }
  }

  async startOrder(orderId:number, lat:number, lng:number) {
      console.log('start order');
      this.ordersLastSnapshots.set(orderId, [[lat,lng], 0]);
      this.ordersCurrent.set(orderId, [0, 0]);
      this.ordersTime.set(orderId, 0);
  }

  @SubscribeMessage('generalDriverLocation')
  async generalDriverLocation(@MessageBody() data: { driverId: number, lat: number, lng: number}) {
    console.log('generalDriverLocation');

    driverNowLocation.set(data.driverId,[data.lat,data.lng]);
    
    this.timer++;

    //if(this.timer%(600)==0){
      //remove driver from any old geohash
      const oldGeohash=driverGeohash.get(data.driverId);
      if(oldGeohash){
        const set = geohashDrivers.get(oldGeohash);
        if(set){
          set.delete(data.driverId);
          //clean up empty sets
          if(set.size===0){
            geohashDrivers.delete(oldGeohash);
          }
        }
      }

      const newGeohash=await geohashEncode(data.lat,data.lng);
      driverGeohash.set(data.driverId,newGeohash);

      //add driver to new geohash set
      if (!geohashDrivers.has(newGeohash)) {
        geohashDrivers.set(newGeohash, new Set<number>());
      }
      geohashDrivers.get(newGeohash)!.add(data.driverId);
    //}
  }

  @SubscribeMessage('driverLocation')
  async handleDriverLocation(@MessageBody() data: { driverId: number, lat: number, lng: number, customerId: number,orderId:number }) {
    console.log('driverLocation');
    this.customerGateway.handleDriverLocation(data);
    
    let t=this.ordersTime.get(data.orderId);
    if(!t){
      console.log('init snapshot');
      this.ordersTime.set(data.orderId,0);
      this.ordersLastSnapshots.set(data.orderId, [[data.lat,data.lng], 0]);

      t=0;
    } 
    t++;
    this.ordersTime.set(data.orderId,t);
    
    await this.checkTime(data.orderId, data.lat, data.lng, t); //this must without await
    
  }

  async checkTime(orderId:number, lat2:number, lng2:number, time:number) {
    console.log('checkTime');
    const [[lat1, lng1], t1] = this.ordersLastSnapshots.get(orderId) ?? [[-1, -1], -1];
    if(lat1==-1){
      throw new Error('eror in checkTime');
    }
    
    if(time%10==0){
      const addedDistance=await calculateDistance(lat1,lng1,lat2,lng2);
      const addedTime=60; //in seconds
      const [d1,tt]=this.ordersCurrent.get(orderId) ?? [-1, -1];
      if(d1==-1){
        throw new Error('eror in checkTime in getting distance from current');
      }

      this.ordersCurrent.set(orderId,[d1+addedDistance,t1+addedTime]);
      this.ordersLastSnapshots.set(orderId,[[lat2,lng2],t1+addedTime]);
      this.updateTimeAndDistanceInDB(orderId); //must not be await
    }
  }

  async updateTimeAndDistanceInDB(orderId:number) {
    const [d,tt]=this.ordersCurrent.get(orderId) ?? [-1, -1];
    if(d==-1){
      throw new Error('eror in checkTime in getting distance from current');
    }
    
    const processingOrder = await this.processingOrderRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });

    if(!processingOrder){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    processingOrder.currDistance=d;
    processingOrder.currTime=tt;
    this.processingOrderRepository.save(processingOrder); //must not be await
  }

  async waitForDriverResponse(orderId: number, timeoutMs = 300_000): Promise<DriverResponse> {
    // Wait for driver response with timeout
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.driverResponses.delete(`${orderId}`);
        resolve({
          accepted:false,
          orderId:orderId,
          rejectReasonId:1
        });
      }, timeoutMs);

      this.driverResponses.set(`${orderId}`, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  }

  sendFinalPriceInfo(driverId: number, data: { orderId: number; totalPrice: number; driverProfit: number; holdersProfit: number; }){
    console.log('driver final price');
    const socketId=this.driverSockets.get(driverId)!
    this.server.to(socketId).emit('final-price', data);
  }

  getSocketConnections(){
    console.log('driverSockets',this.driverSockets)
    const obj = Object.fromEntries(this.driverSockets);
    return {
      drivers:stringify(obj)
    }
  }

  getGeoHash(){
    console.log('driver geohash',driverGeohash);
    console.log('geohash driver',geohashDrivers);
    console.log('driver now location',driverNowLocation);
    return {
      driverGeoHash:driverGeohash,
      geoHashDriver:geohashDrivers,
      driverNowLocation:driverNowLocation
    }
  }
}
