import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProcessingOrder } from './entities/processing-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllProcessigDto } from './dto/findAllProcessing';
import { FindOneProcessingDto } from './dto/findOneProcessing.dto';
import { plainToInstance } from 'class-transformer';
import { ViewProcessingOrderResponseDto } from './dto/response-dto/viewProcessingOrderResponse.dto';
import { paginate } from 'src/shared/utils/paginateFunction';
import { CreateProcessingOrderDto } from './dto/createProcessingOrder.dto';
import { QueryableBase } from 'mysql2/typings/mysql/lib/protocol/sequences/QueryableBase';
import { UpdateProcessingOrderStateDto } from './dto/updateProcessingOrderState.dto';
import { UpdateProcessingDto } from './dto/updateProcessing.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { CustomerGateway } from '../customers/customer.gateway';
import { FindOneDto } from '../customers/dto/findOne.dto';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { DriverGateway } from '../drivers/driver.gateway';
import { PricingService } from '../pricing/pricing.service';
import { NotificationsService } from '../notifications/notifications.service';



@Injectable()
export class ProcessingOrdersService {
  constructor(
    @InjectRepository(ProcessingOrder) private readonly processingOrderRepository: Repository<ProcessingOrder>,
    private readonly cusomterGateway:CustomerGateway,
    //@Inject(forwardRef(() => DriverGateway))
    private readonly driverGateway : DriverGateway,
    private readonly pricingService : PricingService,
    private readonly notificationsService : NotificationsService,
  ) {}


  async findAll(findAllProcessigDto: FindAllProcessigDto) {
    const qb = this.processingOrderRepository.createQueryBuilder('processingOrder');
    
    qb.leftJoinAndSelect('processingOrder.order', 'order');
    qb.leftJoinAndSelect('processingOrder.driver', 'driver');

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

    if (findAllProcessigDto.customerId != null) {
      qb.andWhere('order.customerId = :customerId', {
        customerId: findAllProcessigDto.customerId,
      });
    }

    if (findAllProcessigDto.state != null) {
      qb.andWhere('order.state = :state', {
        state: findAllProcessigDto.state,
      });
    }

    //return await paginate(qb, {page: findAllProcessigDto.page ,limit: findAllProcessigDto.limit ,});
    return await qb.getMany();
  }

  async findOne(findOneProcessingDto:FindOneProcessingDto){
    const qb = this.processingOrderRepository.createQueryBuilder('processingOrder');
    
    qb.leftJoinAndSelect('processingOrder.order', 'order');
    qb.leftJoinAndSelect('processingOrder.driver', 'driver');
    qb.leftJoinAndSelect('processingOrder.truck', 'truck');

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

    if (findOneProcessingDto.id!=null) {
      ok=0;
      qb.andWhere('order.id = :id', { id: findOneProcessingDto.id });
    }
    
    if(ok)return null;

    return qb.getOne();
  }

  async create(createProcessingOrderDto:CreateProcessingOrderDto){
    await this.processingOrderRepository.save({
      order:{id:createProcessingOrderDto.orderId},
      driver:{id:createProcessingOrderDto.driverId},
      truck:{id:createProcessingOrderDto.truckId},
      expectedPrice:createProcessingOrderDto.expectedPrice,
      expectedTime:createProcessingOrderDto.expectedTime,
      state:createProcessingOrderDto.state
    });
  }

  async update(updateProcessingDto:UpdateProcessingDto){
    const processingOrder = await this.getOneIfExist({ id: updateProcessingDto.id });
  
      Object.keys(updateProcessingDto).forEach((key) => {
        if (updateProcessingDto[key] != null && key !== 'id') {
          processingOrder[key] = updateProcessingDto[key];
        }
      });
  
      await this.processingOrderRepository.save(processingOrder);
      return processingOrder;
  }
  
  async getOneIfExist(findOneProcessingDto: FindOneProcessingDto) {
    const order=await this.findOne(findOneProcessingDto);
    if(!order){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return order;
  }

  async updateProcessingOrderState(updateProcessingOrderStateDto:UpdateProcessingOrderStateDto){
    //update db
    const processingOrder=await this.update({id:updateProcessingOrderStateDto.orderId,state:updateProcessingOrderStateDto.state})
    //emit to customer
    this.cusomterGateway.notifyOrderStateChange(processingOrder.order.customerId,updateProcessingOrderStateDto.orderId,updateProcessingOrderStateDto.state)
    
    console.log(updateProcessingOrderStateDto.state);
    if(updateProcessingOrderStateDto.state==ProcessingOrderStateEnum.FINISHED){
      //notify customer that order is finished
      //await this.notificationsService.notify({userId:processingOrder.order.customerId,title:'Finish Order',body:'your order arrived and unloaded'});
      
      console.log("here")
      void (async () => {
        try {
          const finalPriceInfo = await this.pricingService.getFinalPrice({
            orderId: updateProcessingOrderStateDto.orderId,
          });

          console.log('i am in final price');
          console.log('final Price info in processing order',finalPriceInfo)

          // Emit final price to driver
          this.driverGateway.sendFinalPriceInfo(processingOrder.driverId, {
            orderId: updateProcessingOrderStateDto.orderId,
            totalPrice: finalPriceInfo.totalPrice,
            driverProfit: finalPriceInfo.driverProfit,
            holdersProfit: finalPriceInfo.holdersProfit,
          });

          console.log('i am in final price222');

          // Emit final price to customer
          this.cusomterGateway.sendFinalPriceInfo(processingOrder.order.customerId, {
            orderId: updateProcessingOrderStateDto.orderId,
            totalPrice: finalPriceInfo.totalPrice,
            driverProfit: finalPriceInfo.driverProfit,
            holdersProfit: finalPriceInfo.holdersProfit,
          });
        } catch (err) {
          console.error('Error in background processing of final price info:', err);
        }
      })();
    }
    else if(updateProcessingOrderStateDto.state==ProcessingOrderStateEnum.UNLOADING){
      await this.driverGateway.updateTimeAndDistanceInDB(processingOrder.orderId);
    }


    return {}
  }

  async delete(findOneDto:FindOneDto){
    const processingOrder=await this.getOneIfExist(findOneDto);

    await this.processingOrderRepository.delete({id:processingOrder.id});
  }
}
