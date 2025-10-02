import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from './entities/rate.entity';
import { Repository } from 'typeorm';
import { CreateRateDto } from './dto/createRate.dts';
import { ClosedOrdersService } from '../closed-orders/closed-orders.service';
import { DriversService } from '../drivers/drivers.service';
import { Transactional } from 'typeorm-transactional';
import { FindOneDto } from './dto/findOne.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';



@Injectable()
export class RatesService {
  constructor(
    @InjectRepository(Rate) private readonly rateRepository: Repository<Rate>,
    private readonly closedOrdersService:ClosedOrdersService,
    private readonly driversService:DriversService,
    //private readonly usersService: UsersService,
  ) {}

  async findOne(findOneDto:FindOneDto){
    const qb=this.rateRepository.createQueryBuilder('rate');
    let ok=1;
    
    if(findOneDto.id != null){
      ok=0;
      qb.andWhere('rate.id = :id',{id:findOneDto.id});
    }

    if(findOneDto.closedOrderId != null){
      ok=0;
      qb.andWhere('rate.closedOrderId = :closedOrderId',{closedOrderId:findOneDto.closedOrderId});
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async getOneIfExist(findOneDto:FindOneDto){
    const rate=await this.findOne(findOneDto);
    if(!rate){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
  }

  @Transactional()
  async create(createRateDto:CreateRateDto){
    const closedOrder=await this.closedOrdersService.getOneIfExist({id:createRateDto.orderId})

    const eRate=await this.findOne({closedOrderId:closedOrder.id});
    if(eRate != null){
      throw new NotFoundException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    //add the rate to rate table
    const rate=await this.rateRepository.save({
      ...createRateDto,
      closedOrder:{id:closedOrder.id}
    })

    //update the rate in the driver table
    const driver=await this.driversService.getOneIfExist({id:closedOrder.driverId})
    const newRateSum=driver.rateSum+createRateDto.value;
    const newRateCount=driver.rateCount+1;
    const NewRate=newRateSum/newRateCount;
    await this.driversService.update({id:driver.id,rate:NewRate,rateSum:newRateSum,rateCount:newRateCount});


    return rate;
  }

  async getHighLowRated(){
    const result = await this.rateRepository
    .createQueryBuilder('rate')
    .select([
      'SUM(CASE WHEN rate.value < 3 THEN 1 ELSE 0 END) AS low',
      'SUM(CASE WHEN rate.value > 3 THEN 1 ELSE 0 END) AS high',
    ])
    .getRawOne();

  const lowCount = parseInt(result.low, 10);
  const highCount = parseInt(result.high, 10);

  console.log({ lowCount, highCount });
  return{
    highCount:highCount,
    lowCount:lowCount
  }
      
  }

}
