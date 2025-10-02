import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DriverResponse } from "../drivers/dto/response-dto/driverResponse.dto";
import { Injectable } from "@nestjs/common";
import { stringify } from "querystring";



@WebSocketGateway({namespace:'customers',cors:{origin:'*',credentials:true}})
@Injectable()
export class CustomerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private customerSockets = new Map<number, string>(); //Map<customerId, socketId>


  handleConnection(client: Socket) {
    const customerId = client.handshake.auth.customerId;
    if (customerId) {
      this.customerSockets.set(Number(customerId), client.id);
      client.join(`customer-${customerId}`);
      console.log(`Customer ${customerId} connected`);
    } else {
      console.log('Customer connection missing customerId');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [customerId, socketId] of this.customerSockets.entries()) {
      if (socketId === client.id) {
        this.customerSockets.delete(customerId);
        console.log(`Customer ${customerId} disconnected`);
        break;
      }
    }
  }

  sendOrderStatusUpdate(customerId: number,response:DriverResponse) {
    // Server sends an update to customer
    console.log(`Sending order update to customer ${customerId}`);
    const socketId=this.customerSockets.get(customerId)!
    this.server.to(socketId).emit('order-status-update', response);
  }

  notifyOrderStateChange(customerId: number, orderId: number, newState: string) {
    const socketId=this.customerSockets.get(customerId)!
    this.server.to(socketId).emit('orderStateUpdate', {
      orderId,
      state: newState,
    });
  }

  handleDriverLocation(data: { driverId: number, lat: number, lng: number, customerId: number,orderId:number }){
    const socketId=this.customerSockets.get(data.customerId)!
    this.server.to(socketId).emit('updateDriverLocation',data)
  }

  notifyOrderClosed(data:{customerId:number,orderId:number}){
    const socketId=this.customerSockets.get(data.customerId)!
    this.server.to(socketId).emit('orderClosed',data);
  }

  sendFinalPriceInfo(customerId:number,data:{orderId:number,totalPrice:number,driverProfit:number,holdersProfit:number}){
    console.log('customer final price');
    const socketId=this.customerSockets.get(customerId)!
    this.server.to(socketId).emit('final-price', data);
  }

  getSocketConnections(){
    console.log('customerSockets',this.customerSockets)
    const obj = Object.fromEntries(this.customerSockets);
    return {
      customers:stringify(obj)
    }
  }
}
