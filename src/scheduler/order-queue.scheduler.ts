import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PriorityQueue } from '../shared/data-structures/priority-queue';
import { OrderObj } from 'src/common/types/orderObj.interface';
import { DriversService } from 'src/modules/drivers/drivers.service';
import { geohashDrivers, driverGeohash, driverNowLocation } from 'src/common/providers/global-cache/globalCache.provider';
import { SchedulerService } from './scheduler.service';
import { HungarianAlgorithm } from 'src/shared/algorithms/hungarianAlgorithm';
import { DriverGateway } from 'src/modules/drivers/driver.gateway';
import { TryService } from 'src/try/try.service';
import { plainToInstance } from 'class-transformer';
import { SendOrderRequestDto } from 'src/modules/orders/dto/sendOrderRequest.dto';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingOrder } from 'src/modules/pending-orders/entities/pending-order.entity';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { Truck } from 'src/modules/trucks/entities/truck.entity';
import { CustomerGateway } from 'src/modules/customers/customer.gateway';
import { RejectedOrder } from 'src/modules/rejected-orders/entities/rejected-order.entity';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { GoogleMapsService } from 'src/integrations/google-maps/google-maps.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';



@Injectable()
export class OrderQueueScheduler {
  private readonly logger = new Logger(OrderQueueScheduler.name);
  private hungarian = new HungarianAlgorithm();

  constructor(
    @Inject('ORDER_QUEUE') private readonly priorityQueue: PriorityQueue<OrderObj>,
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,    
    @InjectRepository(PendingOrder) private readonly pendingOrderRepository: Repository<PendingOrder>,    
    @InjectRepository(Truck) private readonly truckRepository: Repository<Truck>,
    @InjectRepository(RejectedOrder) private readonly rejectedOrderRepository: Repository<RejectedOrder>,
    @InjectRepository(ProcessingOrder) private readonly processingOrderRepository: Repository<ProcessingOrder>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly schedulerService: SchedulerService,
    private readonly driverGateway: DriverGateway,
    private readonly customerGateway: CustomerGateway,
    private readonly googleMapsService: GoogleMapsService,
  ) {}


  @Interval(10000) // runs every 5 seconds
  async processOrders() {
    const batchSize = Math.min(this.priorityQueue.size(), 500);
    const batch: OrderObj[] = [];

    console.log('y1');

    // take top 500
    for (let i = 0; i < batchSize; i++) {
      const order=await this.priorityQueue.pop();
      if(!order)continue;
      order.numberOfAttempts*=-1;
      batch.push(order);
    }
    console.log('batch= ',batch);
    if(batch[0])console.log('test= ',batch[0].order.toAddress);

    if(batch.length==0)return;

    console.log('y2');

    //get suitable drivers for the orders
    const driversSet=await this.schedulerService.getNearbyDrivers(batch);
    console.log('y3');
    //return the orders to queue if didnt find any suitable drivers
    if(driversSet.size==0){
      for (let i = 0; i < batch.length; i++){
        batch[i].numberOfAttempts++;
        this.schedulerService.addToQueue(batch[i]);
      }
      return;
    }

    console.log('y4');

    let drivers: number[]=[];
    for(let d of driversSet){
      drivers.push(d);
    }
    console.log('drivers= ',drivers);

    console.log('y5');

    this.logger.log(`Processing ${batch.length} orders`);
    
    //match drivers and orders
    const result=await this.hungarian.solve(batch,drivers,this.driverRepository,this.googleMapsService); //[orderObj,driverId]

    console.log('y6');
    console.log('result= ',result);

    //send requests to drivers
    for(const [orderObj, driverId] of result){
      if(driverId==-1){
        //add order back to queue
        this.schedulerService.addToQueue(orderObj);
        continue;
      }
      this.sendOrderRequestToDriver(orderObj,driverId); //must not be await
    }

    console.log('y7');
  }

  async sendOrderRequestToDriver(order: OrderObj, driverId:number){
    order.sendOrderRequestDto.driverId=driverId;
    
    let driver=await this.driverRepository.findOneBy({id:driverId});
    if(!driver){
      throw new Error('error in assignment in driver');
    }
    console.log('id= ',driverId);
    let truck = await this.truckRepository.findOne({
      where: {
        driver: { id: driverId }, 
        isAvailable: 1
      },
      relations: ['driver'],
    });    
    console.log('is here??');
    if(!truck){
      throw new Error('error in assignment in driver truck');
    }

    //mark driver unavailable
    driver.isAvailable=0;
    await this.driverRepository.save(driver);
    
    this.driverGateway.sendOrderRequest(driverId,order.sendOrderRequestDto);

    //update pendingOrder driverId
    let pendingOrder = await this.pendingOrderRepository.findOne({
      where: {
        order: { id: order.orderId },
      },
      relations: ['order'],
    });  
    console.log(pendingOrder);
    if(!pendingOrder){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    pendingOrder.driverId=driverId;
    await this.pendingOrderRepository.save(pendingOrder);

    console.log('yoyo1');

    const response = await this.driverGateway.waitForDriverResponse(order.orderId)!;

    console.log('yoyo2');

    if(response.accepted){ //driver accept order
      console.log('acc');
      const [lat,lng] = driverNowLocation.get(driverId) ?? [-1, -1];
      if(lat===-1){
          throw new Error('in matching evaluation');
      }
      await this.driverGateway.startOrder(order.orderId,lat,lng);

      //mark driver's truck unavailable
      truck.isAvailable=0;
      await this.truckRepository.save(truck);

      //create processing order
      await this.processingOrderRepository.save({
        order:{id:order.orderId},
        driver:{id:driverId},
        truck:{id:truck.id},
        expectedPrice:order.sendOrderRequestDto.expectedPrice,
        expectedTime:order.sendOrderRequestDto.expectedTime,
        state:ProcessingOrderStateEnum.PREPARING
      });

      //update state to processing
      const orderInfo=await this.orderRepository.findOneBy({id:order.orderId});
      if(!orderInfo){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
      }
      orderInfo.state=OrderStateEnum.PROCESSING;
      await this.orderRepository.save(orderInfo);

      //delete pending order
      await this.pendingOrderRepository.delete({ order: { id: order.orderId } });


      //notify customer using customerGateway
      this.customerGateway.sendOrderStatusUpdate(order.order.customerId,{orderId:order.orderId,accepted:response.accepted});
    }
    else{ //driver reject order
      console.log('rej');
      //mark driver available
      driver.isAvailable=1;
      await this.driverRepository.save(driver);

      //mark driver's truck available
      truck.isAvailable=1;
      await this.truckRepository.save(truck);

      //add driver to rejectedDrivers list in order
      order.rejectedDrivers.push(driverId);

      //increase by 1 order number of attempts
      order.numberOfAttempts++;

      //create rejected order
      await this.rejectedOrderRepository.save({
        order:{id:order.orderId},
        driver:{id:driverId},
        rejectReason:{id:response.rejectReasonId!}
      });

      //add back the order to the queue
      this.schedulerService.addToQueue(order);
    }
  }
}
