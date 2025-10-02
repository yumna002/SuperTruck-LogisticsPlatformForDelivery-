import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { CreateDto } from './dto/create.dto';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { UpdateDto } from './dto/update.dto';
import { ItemsService } from '../items/items.service';
import { Transactional } from 'typeorm-transactional';
import { plainToInstance } from 'class-transformer';
import { ViewOrderResponseDto } from './dto/response-dto/viewOrderResponse.dto';
import { paginate } from 'src/shared/utils/paginateFunction';
import { ConfirmOrderDto } from './dto/confirmOrder.dto';
import { DriversService } from '../drivers/drivers.service';
import { ProcessingOrdersService } from '../processing-orders/processing-orders.service';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { CustomerGateway } from '../customers/customer.gateway';
import { Photo } from './entities/photo.entity';
import { DriverGateway } from '../drivers/driver.gateway';
import { PendingOrdersService } from '../pending-orders/pending-orders.service';
import { ClosedOrdersService } from '../closed-orders/closed-orders.service';
import { CloseOrderDto } from './dto/closeOrder.dto';
import { TrucksService } from '../trucks/trucks.service';
import { Address } from '../addresses/entities/address.entity';
import { PaymentType } from '../payments/entities/payment-type.entity';
import { VehicleType } from '../truck-models/entities/vehicle-type.entity';
import { SizeType } from '../truck-models/entities/size-type.entity';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { SendOrderRequestDto } from './dto/sendOrderRequest.dto';
import { ScheduledOrdersService } from '../scheduled-orders/scheduled-orders.service';
import { assignDriverDto } from './dto/assignDriver.dto';
import { convertToSeconds } from 'src/shared/utils/timeInSecondsFunction';



@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Photo) private readonly photoRepository: Repository<Photo>,
    private readonly itemsService : ItemsService,
    @Inject(forwardRef(() => DriversService))
    private readonly driversService: DriversService,
    @Inject(forwardRef(() => DriverGateway))
    private readonly driverGateway: DriverGateway,
    @Inject(forwardRef(() => ProcessingOrdersService))
    private readonly processingOrdersService: ProcessingOrdersService,
    private readonly pendingOrdersService: PendingOrdersService,
    @Inject(forwardRef(() => ScheduledOrdersService))
    private readonly scheduledOrdersService : ScheduledOrdersService,
    private readonly customerGateway:CustomerGateway,
    private readonly closedOrdersService:ClosedOrdersService,
    private readonly trucksService:TrucksService,
    private readonly schedulerService:SchedulerService,
    @Inject(REQUEST) private request: Request,
    //private readonly usersService: UsersService,
  ) {}

  
  async findAll(findAllDto:FindAllDto) {
    const qb = this.orderRepository.createQueryBuilder('order');

    qb.leftJoinAndSelect('order.items', 'item');
    qb.leftJoinAndSelect('item.categoryType', 'categoryType');
    qb.leftJoinAndSelect('categoryType.category', 'category');
    qb.leftJoinAndSelect('item.itemSize', 'itemSize');
    qb.leftJoinAndSelect('item.itemWeight', 'itemWeight');
    qb.leftJoinAndSelect('order.customer', 'customer');
    qb.leftJoinAndSelect('order.fromAddress', 'fromAddress');
    qb.leftJoinAndSelect('order.toAddress', 'toAddress');
    qb.leftJoinAndSelect('order.vehicleType', 'vehicleType');
    qb.leftJoinAndSelect('order.sizeType', 'sizeType');
    qb.leftJoinAndSelect('order.paymentType', 'paymentType');
    qb.leftJoinAndSelect('order.processingOrders', 'processingOrders');
    qb.leftJoinAndSelect('order.closedOrders', 'closedOrders');
    qb.leftJoinAndSelect('order.photos','photos')

    if(findAllDto.customerId!=null){
      qb.andWhere('order.customerId = :customerId',{ customerId: findAllDto.customerId})
    }
    if(findAllDto.state!=null){
      qb.andWhere('order.state = :state',{state : findAllDto.state});
    }

    /*if (findAllDto.orderSizeId!=null) {
      qb.andWhere('order.orderSizeId = :orderSizeId', { orderSizeId: findAllDto.orderSizeId });
    }*/

    //return await paginate(qb, {page: findAllDto.page ,limit: findAllDto.limit ,});
    return await qb.getMany();
  }

  async findOne(findOneDto: FindOneDto) {
    const qb = this.orderRepository.createQueryBuilder('order');

    qb.leftJoinAndSelect('order.items', 'item');
    qb.leftJoinAndSelect('item.categoryType', 'categoryType');
    qb.leftJoinAndSelect('categoryType.category', 'category');
    qb.leftJoinAndSelect('item.itemSize', 'itemSize');
    qb.leftJoinAndSelect('item.itemWeight', 'itemWeight');
    qb.leftJoinAndSelect('order.customer', 'customer');
    qb.leftJoinAndSelect('order.fromAddress', 'fromAddress');
    qb.leftJoinAndSelect('order.toAddress', 'toAddress');
    qb.leftJoinAndSelect('order.vehicleType', 'vehicleType');
    qb.leftJoinAndSelect('order.sizeType', 'sizeType');
    qb.leftJoinAndSelect('order.paymentType', 'paymentType');
    qb.leftJoinAndSelect('order.processingOrders', 'processingOrders');
    qb.leftJoinAndSelect('order.closedOrders', 'closedOrders');
    qb.leftJoinAndSelect('order.photos','photos')
           
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('order.id = :id', { id: findOneDto.id });
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async create(createDto:CreateDto) {
    const newOrder=this.orderRepository.save({
      state:createDto.state,
      customer:{id:createDto.customerId}
    });

    return newOrder;
  }

  //@Transactional()
  async update(updateDto:UpdateDto) {
    const order = await this.getOneIfExist({ id: updateDto.id });
    const orderObj =await this.orderRepository.findOneBy({id:updateDto.id});

    if (updateDto.photos?.length && orderObj) {
      const photoEntities = [];

      for (const path of updateDto.photos) {
        const savedPhoto = await this.photoRepository.save({
          path: path,
          order: orderObj,
        });
        //await this.photoRepository.save(savedPhoto);

        //photoEntities.push(savedPhoto);
        order.photos.push(savedPhoto);
      }

      console.log("photos", photoEntities);
    }
    // Handle regular primitive fields
      const ignoreKeys = ['id', 'photos', 'fromAddressId', 'toAddressId', 'vehicleTypeId', 'sizeTypeId', 'paymentTypeId'];
      Object.keys(updateDto).forEach(async (key) => {
        if (updateDto[key] != null && !ignoreKeys.includes(key)) {
          order[key] = updateDto[key];
        }
      });

      // Handle relations by setting partial objects
      if (updateDto.fromAddressId) {
        order.fromAddress = { id: updateDto.fromAddressId } as Address;
      }
      if (updateDto.toAddressId) {
        order.toAddress = { id: updateDto.toAddressId } as Address;
      }
      if (updateDto.vehicleTypeId) {
        order.vehicleType = { id: updateDto.vehicleTypeId } as VehicleType;
      }
      if (updateDto.sizeTypeId) {
        order.sizeType = { id: updateDto.sizeTypeId } as SizeType;
      }
      if (updateDto.paymentTypeId) {
        order.paymentType = { id: updateDto.paymentTypeId } as PaymentType;
      }

    await this.orderRepository.save(order);
    return order;
  }

  async getOneIfExist(findOneDto: FindOneDto) {
    const order=await this.findOne(findOneDto);
    if(!order){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return order;
  }

  async isExist(findOneDto: FindOneDto) {
    const order=await this.findOne(findOneDto);
    if(!order)return false;
    else return true;
  } 

  @Transactional()
  async delete(findOneDto : FindOneDto){
    const order=await this.getOneIfExist(findOneDto);
      
    //delete related items
    this.itemsService.deleteItems({orderId:order.id});
      
    await this.orderRepository.delete(order.id);
        
    return {}
  }

  //@Transactional()
  async confirmOrder(confirmOrderDto:ConfirmOrderDto){
    //check order state
    const order=await this.getOneIfExist({id:confirmOrderDto.id});
    console.log('here')
    if(order.state!==OrderStateEnum.DRAFT){
      console.log('hhhh')
      throw new BadRequestException(I18nKeys.exceptionMessages.orderAlreadyConfirmedException)
    }


    // change order state from draft to pending
    // update payementType id
    await this.update({id:confirmOrderDto.id,state:OrderStateEnum.PENDING,paymentTypeId:confirmOrderDto.paymentTypeId})
    await this.pendingOrdersService.create({orderId:confirmOrderDto.id});
    
    const assignDriverDto={
      ...confirmOrderDto,
      expectedTime:convertToSeconds(confirmOrderDto.expectedTime)
    }
    console.log('i am that one');
    console.log(assignDriverDto);
    
    //check if the order is scheduled
    if(order.isScheduled){
      console.log('is that');
      this.assignDriver(assignDriverDto);
    }
    else{
      const updatedOrder=await this.findOne({id:order.id});
      if(!updatedOrder){
        throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
      }
      
      const fullOrderData={
        order:updatedOrder,
        confirmOrder:assignDriverDto
      }
  
      const sendOrderRequest=plainToInstance(SendOrderRequestDto,fullOrderData,{
        excludeExtraneousValues:true
      })
      sendOrderRequest.customerId=order.customerId;
  
      //to add order to queue
      this.schedulerService.addNewOrder({
        orderId: order.id, 
        latitude: order.fromAddress.latitude, 
        longitude: order.fromAddress.longitude,
        order: updatedOrder,
        sendOrderRequestDto:sendOrderRequest
      }); //must be without sync
  
      console.log('what is wrong');

    }  
    return{}
  }

  //@Transactional()
  async assignDriver(assignDriverDto:assignDriverDto){
    //get the order
    const order=await this.getOneIfExist({id:assignDriverDto.id})

    //look for the best driver 
    const response=await this.driversService.matchOrderDriver({order:order,expectedTime:assignDriverDto.expectedTime,expectedPrice:assignDriverDto.expectedPrice,distance:assignDriverDto.expectedPrice,holdersProfit:assignDriverDto.holdersProfit,driverProfit:assignDriverDto.driverProfit})


    let orderNotCancelled=true;
    //if the order wasn't assigned to a driver
    if(!response.accepted){
      //to draft 
      
      //if order is already draft it has been cancelled
      const newOrder=await this.getOneIfExist({id:assignDriverDto.id})
      if(newOrder.state==OrderStateEnum.DRAFT){
        orderNotCancelled=false;
      }
      else{
        await this.update({id:order.id,state:OrderStateEnum.DRAFT})
      }
      
    }
    else if(response.accepted){
      //add order to scheduled 
      ///

      //create a scheduled order
      await this.scheduledOrdersService.create({orderId:assignDriverDto.id,driverId:response.driverId,truckId:response.truckId,expectedPrice:assignDriverDto.expectedPrice,expectedTime:assignDriverDto.expectedTime})
      
      //update the state to scheduled
      await this.update({id:order.id,state:OrderStateEnum.SCHEDULED});
    }

    //delete pending
    const pendingOrder=await this.pendingOrdersService.findOne({orderId:order.id})
    if(pendingOrder){
      this.pendingOrdersService.delete(pendingOrder.id)
    }
    
    //send response to customer
    if(orderNotCancelled)
      this.customerGateway.sendOrderStatusUpdate(order.customerId,{orderId:order.id,accepted:response.accepted})
  }

  async cancelPendingOrder(findOneDto:FindOneDto){
    const order=await this.getOneIfExist(findOneDto);

    //change state to draft 
    await this.update({id:order.id,state:OrderStateEnum.DRAFT});
    
    //emit to driver
    const pendingOrder=await this.pendingOrdersService.findOne({orderId:order.id})
    console.log("pending order in cancelation",pendingOrder)
    if(pendingOrder && pendingOrder.driverId!=null){
      console.log('emit to driver')
      this.driverGateway.cancelOrderRequest(pendingOrder.driverId,order.id);
    }
  }

  @Transactional()
  async closeOrder(closeOrderDto:CloseOrderDto){
    const processingOrder=await this.processingOrdersService.getOneIfExist({id:closeOrderDto.id})

    //add to closed - change state
    await this.closedOrdersService.create({
      orderId:closeOrderDto.id,
      driverId:processingOrder.driverId,
      expectedPrice:processingOrder.expectedPrice,
      finalDriverPrice:closeOrderDto.finalDriverPrice,
      finalHolderPrice:closeOrderDto.finalHolderPrice,
      finalPrice:closeOrderDto.finalPrice,
      finalDistance:processingOrder.currDistance,
      finalTime:processingOrder.currTime
    });
    await this.update({id:closeOrderDto.id,state:OrderStateEnum.CLOSED});
    
    //change driver and truck to avaliable
    await this.driversService.update({id:processingOrder.driverId,isAvailable:1});
    await this.trucksService.update({id:processingOrder.truckId,isAvailable:1});

    //remove from processing
    await this.processingOrdersService.delete({id:processingOrder.orderId});

    //emit closing
    await this.customerGateway.notifyOrderClosed({customerId:processingOrder.order.customerId,orderId:processingOrder.orderId});
  }

  async getOrdersStatistics(){
    const now = new Date();

    // First day of this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Last millisecond of this month
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await this.orderRepository
      .createQueryBuilder('order')
      // Join closed_orders
      .leftJoin('closed_order', 'closed', 'closed.orderId = order.id')
      // Join rejected_orders
      .leftJoin('rejected_order', 'rejected', 'rejected.orderId = order.id')
      // Filter orders created this month
      .where('order.createdAt BETWEEN :start AND :end', { start: monthStart, end: monthEnd })
      // Count closed orders
      .select('COUNT(DISTINCT closed.orderId)', 'closedCount')
      // Count rejected orders (distinct orderId) that are not closed
      .addSelect('COUNT(DISTINCT CASE WHEN closed.orderId IS NULL THEN rejected.orderId END)', 'rejectedCount')
      .getRawOne();

    const closedCount = parseInt(result.closedCount, 10);
    const rejectedCount = parseInt(result.rejectedCount, 10);
    const total = closedCount + rejectedCount;

    const closedPercentage = total ? parseFloat(((closedCount / total) * 100).toFixed(2)) : 0;
    const rejectedPercentage = total ? parseFloat(((rejectedCount / total) * 100).toFixed(2)) : 0;

    const statistics:{name:string,value:number}[]=[];
    statistics.push({name:'closed',value:closedPercentage});
    statistics.push({name:'rejected',value:rejectedPercentage});

    const colors= [ "#00C49F", "#FFBB28"];



    return {
      statistics:statistics,
      colors:colors
    };
  }

  async getCustomerSocketConnections(){
    return this.customerGateway.getSocketConnections();
  }
  
}
