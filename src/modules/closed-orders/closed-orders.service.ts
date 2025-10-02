import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllClosedDto } from './dto/findAllClosed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClosedOrder } from './entities/closed-order.entity';
import { Repository } from 'typeorm';
import { FindOneClosedDto } from './dto/findOneClosed.dto';
import { plainToInstance } from 'class-transformer';
import { ViewCloseOrderResponseDto } from './dto/response-dto/viewClosedOrderResponse.dto';
import { paginate } from 'src/shared/utils/paginateFunction';
import { CreateDto } from './dto/create.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { UpdateDto } from './dto/update.dto';



@Injectable()
export class ClosedOrdersService {
  constructor(
    @InjectRepository(ClosedOrder) private readonly closedOrdersRepository : Repository<ClosedOrder>
  ) {}
  

  async findAll(findAllDto : FindAllClosedDto) {
    const qb = this.closedOrdersRepository.createQueryBuilder('closedOrder');
    
    qb.leftJoinAndSelect('closedOrder.order', 'order');
    qb.leftJoinAndSelect('closedOrder.driver', 'driver');

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
    qb.leftJoinAndSelect('closedOrder.rate' , 'rate');
    qb.leftJoinAndSelect('driver.user','driverUser');
    qb.leftJoinAndSelect('order.photos','photos');

    if (findAllDto.customerId != null) {
      qb.andWhere('order.customerId = :customerId', {
        customerId: findAllDto.customerId,
      });
    }
    if (findAllDto.driverId != null) {
      qb.andWhere('closedOrder.driverId = :driverId', {
        driverId: findAllDto.driverId,
      });
    }

    if (findAllDto.state != null) {
      qb.andWhere('order.state = :state', {
        state: findAllDto.state,
      });
    }

    if (findAllDto.isPaid != null){
      qb.andWhere('closedOrder.isPaid = :isPaid', {
        isPaid: findAllDto.isPaid,
      });  
    }

    //return await paginate(qb, {page: findAllDto.page , limit: findAllDto.limit});
    return await qb.getMany();
  }

  async findOne(findOneDto : FindOneClosedDto){
    const qb = this.closedOrdersRepository.createQueryBuilder('closedOrder');
    
    qb.leftJoinAndSelect('closedOrder.order', 'order');
    qb.leftJoinAndSelect('closedOrder.driver', 'driver');

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
    qb.leftJoinAndSelect('closedOrder.rate' , 'rate');
    qb.leftJoinAndSelect('driver.user','driverUser');
    qb.leftJoinAndSelect('order.photos','photos');
    
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('order.id = :id', { id: findOneDto.id });
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async getOneIfExist(findOneDto: FindOneClosedDto) {
    const closedOrder=await this.findOne(findOneDto);
    if(!closedOrder){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return closedOrder;
  }

  async create(createDto : CreateDto){
    const closedOrder=await this.closedOrdersRepository.save({
      ...createDto,
      order:{id : createDto.orderId},
      driver:{id : createDto.driverId}
    })

    return closedOrder;
  }

  async update(updateDto : UpdateDto){
    const closedOrder=await this.getOneIfExist({id:updateDto.id});
    
    Object.keys(updateDto).forEach(async (key) => {
      if (updateDto[key] != null && key !== 'id') {
          closedOrder[key] = updateDto[key];
      }
    });

    await this.closedOrdersRepository.save(closedOrder);
    return closedOrder;
  }

  async getLastTransferOrder(data:{customerId:number}){
    const lastOrder = await this.closedOrdersRepository.findOne({
      relations: {
        order: true,
      },
      where: {
        order: {
          customer: { id: data.customerId },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return lastOrder;
  }

  async getDriverTotalPaymentAmount(data:{driverId:number}){
    const qb = this.closedOrdersRepository.createQueryBuilder('closedOrder');
    
    qb.select([
      `SUM(
        CASE WHEN paymentType.name_en = 'cash' THEN closedOrder.finalPrice - (closedOrder.finalDriverPrice + closedOrder.finalHolderPrice) 
        ELSE -(closedOrder.finalDriverPrice + closedOrder.finalHolderPrice) END
      ) AS balance`,
    ]);
    
    qb.leftJoin('closedOrder.order','order');
    qb.leftJoin('order.paymentType', 'paymentType');
    qb.where('closedOrder.driverId = :driverId', { driverId:data.driverId });
    qb.andWhere('closedOrder.isPaid = false');

    const result = await qb.getRawOne();

    const balance = parseFloat(result.balance || '0');

    return balance;
  }

}