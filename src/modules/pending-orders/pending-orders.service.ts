import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePendingOrderDto } from './dto/create-pending-order.dto';
import { UpdatePendingOrderDto } from './dto/update-pending-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PendingOrder } from './entities/pending-order.entity';
import { Repository } from 'typeorm';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dt';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { Transactional } from 'typeorm-transactional';
import { Driver } from '../drivers/entities/driver.entity';



@Injectable()
export class PendingOrdersService {
  constructor(
    @InjectRepository(PendingOrder) private readonly pendingOrderRepository : Repository<PendingOrder>,
    @InjectRepository(Driver) private readonly driverRepository : Repository<Driver>
  ){}

  
  async create(createPendingOrderDto: CreatePendingOrderDto) {
    const pendingOrder=await this.pendingOrderRepository.save({
      order:{id:createPendingOrderDto.orderId},
      driver:{id:createPendingOrderDto.driverId}
    }) 
    return pendingOrder
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.pendingOrderRepository.createQueryBuilder('pendingOrder');
  

    if(findAllDto.id!=null){
      qb.andWhere('order.id = :id',{ id: findAllDto.id})
    }
    if(findAllDto.orderId!=null){
      qb.andWhere('order.orderId = :orderId',{orderId : findAllDto.orderId});
    }


    return await qb.getMany();
  }

  async findOne(findOneDto:FindOneDto) {
    const qb = this.pendingOrderRepository.createQueryBuilder('pendingOrder');
           
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('pendingOrder.id = :id', { id: findOneDto.id });
    }
    if (findOneDto.orderId!=null) {
      ok=0;
      qb.andWhere('pendingOrder.orderId = :orderId', { orderId: findOneDto.orderId });
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  @Transactional()
  async update(updatePendingOrderDto:UpdatePendingOrderDto) {
      const pendingOrder = await this.pendingOrderRepository.findOne({
        where: { id: updatePendingOrderDto.id },
        relations: ['driver'],
      });

      if (!pendingOrder) {
        throw new Error(`PendingOrder with id ${updatePendingOrderDto.id} not found`);
      }

      // Assign existing driver or clear
      if (updatePendingOrderDto.driverId !== null) {
        // Option 1: Use `preload` to avoid partial object
        const driver = await this.driverRepository.findOneBy({ id: updatePendingOrderDto.driverId });
        if (!driver) throw new Error(`Driver with id ${updatePendingOrderDto.driverId} not found`);
        pendingOrder.driver = driver;
      } else {
        pendingOrder.driver = null;
      }

      // Save the pendingOrder with the new relation
      await this.pendingOrderRepository.save(pendingOrder);

      // Confirm and log for debugging
      const confirmed = await this.pendingOrderRepository.findOne({
        where: { id: updatePendingOrderDto.id },
        relations: ['driver'],
      });

      console.log('✅ Updated pendingOrder.driverId to:', confirmed?.driver?.id ?? 'null');
      return confirmed
  }

  async getOneIfExist(findOneDto: FindOneDto) {
    const pendingOrder=await this.findOne(findOneDto);
    if(!pendingOrder){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return pendingOrder;
  }
  
  async delete(id:number){
    await this.pendingOrderRepository.delete({id:id})
  }
}
