import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduledOrderDto } from './dto/create-scheduled-order.dto';
import { UpdateScheduledOrderDto } from './dto/update-scheduled-order.dto';
import { FindAllScheduledDto } from './dto/findAllScheduled.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduledOrder } from './entities/scheduled-order.entity';
import { Repository } from 'typeorm';
import { paginate } from 'src/shared/utils/paginateFunction';
import { FindOneScheduledDto } from './dto/findOneScheduled.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { StartScheduledOrderDto } from './dto/startScheduledOrder.dto';
import { OrdersService } from '../orders/orders.service';
import { ProcessingOrdersService } from '../processing-orders/processing-orders.service';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { driverNowLocation } from 'src/common/providers/global-cache/globalCache.provider';
import { DriverGateway } from '../drivers/driver.gateway';
import { NotificationsService } from '../notifications/notifications.service';



@Injectable()
export class ScheduledOrdersService {
  constructor (
    @InjectRepository(ScheduledOrder) private readonly scheduledOrderRepository:Repository<ScheduledOrder>,
    @Inject(forwardRef(()=>OrdersService))
    private readonly ordersService:OrdersService,
    private readonly driverGateway:DriverGateway,
    private readonly notificationsService:NotificationsService,
    private readonly processingOrderService:ProcessingOrdersService
  ){}


  async findAll(findAllScheduledDto: FindAllScheduledDto) {
    const qb = this.scheduledOrderRepository.createQueryBuilder('scheduledOrder');
    
    qb.leftJoinAndSelect('scheduledOrder.order', 'order');
    qb.leftJoinAndSelect('scheduledOrder.driver', 'driver');

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
    qb.leftJoinAndSelect('driver.user','driverUser');
    qb.leftJoinAndSelect('order.photos','photos')

    if (findAllScheduledDto.customerId != null) {
      qb.andWhere('order.customerId = :customerId', {
        customerId: findAllScheduledDto.customerId,
      });
    }

    if (findAllScheduledDto.state != null) {
      qb.andWhere('order.state = :state', {
        state: findAllScheduledDto.state,
      });
    }

    //return await paginate(qb, {page: findAllScheduledDto.page ,limit: findAllScheduledDto.limit ,});
    return await qb.getMany();
  }

  async findOne(findOnescheduledDto:FindOneScheduledDto){
    const qb = this.scheduledOrderRepository.createQueryBuilder('scheduledOrder');
    
    qb.leftJoinAndSelect('scheduledOrder.order', 'order');
    qb.leftJoinAndSelect('scheduledOrder.driver', 'driver');

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
    qb.leftJoinAndSelect('driver.user','driverUser');
    qb.leftJoinAndSelect('order.photos','photos')

    let ok=1;

    if (findOnescheduledDto.id!=null) {
      ok=0;
      qb.andWhere('order.id = :id', { id: findOnescheduledDto.id });
    }

    if (findOnescheduledDto.driverId!=null) {
      ok=0;
      qb.andWhere('scheduledOrder.driverId = :driverId', { driverId: findOnescheduledDto.driverId });
    }

    if(findOnescheduledDto.startDateTime !=null && findOnescheduledDto.endDateTime!=null){
      ok=0;
      
      console.log('start',findOnescheduledDto.startDateTime)
      console.log('end',findOnescheduledDto.endDateTime);
      qb.andWhere('order.orderDateTime BETWEEN :start AND :end',
      {
        start: findOnescheduledDto.startDateTime,
        end: findOnescheduledDto.endDateTime,
      })
    }
    
    if(ok)return null;

    return qb.getOne();
  }

  async create(createScheduledOrderDto:CreateScheduledOrderDto){
    await this.scheduledOrderRepository.save({
      order:{id:createScheduledOrderDto.orderId},
      driver:{id:createScheduledOrderDto.driverId},
      truck:{id:createScheduledOrderDto.truckId},
      expectedPrice:createScheduledOrderDto.expectedPrice,
      expectedTime:createScheduledOrderDto.expectedPrice
    });
  }
  
  async update(updateScheduledDto:UpdateScheduledOrderDto){
    const scheduledOrder = await this.getOneIfExist({ id: updateScheduledDto.id });
  
      Object.keys(updateScheduledDto).forEach((key) => {
        if (updateScheduledDto[key] != null && key !== 'id') {
          scheduledOrder[key] = updateScheduledDto[key];
        }
      });
  
      await this.scheduledOrderRepository.save(scheduledOrder);
      return scheduledOrder;
  }
  
  async getOneIfExist(findOneScheduledDto: FindOneScheduledDto) {
    const order=await this.findOne(findOneScheduledDto);
    if(!order){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return order;
  }

  async delete(findOneScheduled:FindOneScheduledDto){
    const processingOrder=await this.getOneIfExist(findOneScheduled);

    await this.scheduledOrderRepository.delete({id:processingOrder.id});
  }

  async startScheduledOrder(startScheduledOrderDto:StartScheduledOrderDto){
    //get the scheduled order by id
    const scheduledOrder=await this.getOneIfExist({id:startScheduledOrderDto.orderId})

    const [lat,lng] = driverNowLocation.get(scheduledOrder.driverId) ?? [-1, -1];
    if(lat===-1){
        throw new Error('in matching evaluation');
    }
    await this.driverGateway.startOrder(scheduledOrder.orderId,lat,lng);

    //add to proccesing order
    const proccesingOrder=await this.processingOrderService.create({
      orderId:startScheduledOrderDto.orderId,
      driverId:scheduledOrder.driverId,
      truckId:scheduledOrder.truckId,
      expectedPrice:scheduledOrder.expectedPrice,
      expectedTime:scheduledOrder.expectedTime,
      state:ProcessingOrderStateEnum.PREPARING
    })

    //change state from scheduled to processing
    await this.ordersService.update({id:scheduledOrder.orderId,state:OrderStateEnum.PROCESSING})
    //remove from scheduledOrders table 
    await this.delete({id:scheduledOrder.orderId});

    //send notification to customer 
    //notify customer that scheduled order is starting
    await this.notificationsService.notify({userId:scheduledOrder.order.customerId,title:'Start Scheduled Order',body:'your scheduled order is starting now'});
  }
}
