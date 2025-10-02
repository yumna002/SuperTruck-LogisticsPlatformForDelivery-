import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { DriversService } from '../drivers/drivers.service';
import { ClosedOrdersService } from '../closed-orders/closed-orders.service';
import { Profit } from './entities/profit.entity';
import { plainToInstance } from 'class-transformer';
import { GetDriverOrdersPaymentListDto } from './dto/response/getDriverOrdersPaymentList.dto';
import { PayOrderDto } from './dto/payOrder.dto';
import { GetDriverPaymentsDto } from './dto/getDriverPayments.dto';
import { UpdateProfitDto } from './dto/updateProfit.dto';
import { GetDriversPaymentsListDto } from './dto/getDriversPaymentsList.dto';



@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentType) private readonly paymentTypeRepository: Repository<PaymentType>,
    @InjectRepository(Profit) private readonly profitRepository: Repository<Profit>,
    @Inject(REQUEST) private request: Request,
    @Inject(forwardRef(() => DriversService)) private readonly driversService: DriversService,
    private readonly closedOrdersService : ClosedOrdersService,
    //private readonly usersService: UsersService,
  ) {}


  async findOne(findOneDto: FindOneDto):Promise<PaymentType|null> {
    const qb = this.paymentTypeRepository.createQueryBuilder('paymentType');
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('paymentType.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.name!=null) {
      ok=0;
      qb.andWhere('paymentType.name = :name', { name: findOneDto.name });
    }

    if(ok)return null;
    
    return await qb.getOne();
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<PaymentType> {
    const paymentType=await this.findOne(findOneDto);
    if(!paymentType){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return paymentType;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const paymentType=await this.findOne(findOneDto);
    if(!paymentType)return false;
    else return true;
  }

  async findAll(findAllDto:FindAllDto){
    const qb = this.paymentTypeRepository.createQueryBuilder('paymentType');

    return await qb.getMany();
  }

  async getGeneralProfitPercentage(){
    const profit=await this.profitRepository.findOne({where : { id:1 }});
    if(!profit){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException)
    }
    return profit.CompanyProfitPercentage;
  }
  

  async getMyPaymentDetails(){
    const driver=await this.driversService.getCurrentDriver();

    //get the total amount 
    const totalAmount=await this.closedOrdersService.getDriverTotalPaymentAmount({driverId:driver.id});

    //get the absolute value and the type of the amount 
    const type = totalAmount>0 ? "Pay" : "Receive" ;
    const amount = Math.abs(totalAmount);

    //get the list of unpaid orders
    const orders=await this.closedOrdersService.findAll({driverId:driver.id,isPaid:0});

    //get the dirver profit percentage
    const generalProfitPer=await this.getGeneralProfitPercentage();
    const driverExtraProfitPer=driver.extraProfit;
    const totalDriverProfitPer=100-generalProfitPer+driverExtraProfitPer;
    

    const filteredOrdersList=plainToInstance(GetDriverOrdersPaymentListDto,orders,{
      excludeExtraneousValues:true
    })
    return {
      amount:amount,
      type:type,
      profitPercentage:totalDriverProfitPer,
      orders:filteredOrdersList
    }

  }

  async getDriversPaymentsList(getDriversPaymentsListDto:GetDriversPaymentsListDto){
    const drivers=await this.driversService.findAll(getDriversPaymentsListDto);
    const result = await Promise.all(
      drivers.elements.map(async driver => {
        const totalAmount = await this.closedOrdersService.getDriverTotalPaymentAmount({ driverId: driver.id });

        const type = totalAmount > 0 ? "Pay" : "Receive";
        const amount = Math.abs(totalAmount);
        const isPaid = amount === 0 ? 1 : 0;

        return {
          driverId:driver.id,
          driverName: `${driver.firstName} ${driver.lastName}`,
          type,
          amount,
          isPaid,
        };
      })
    )

    return result;
  }

  async getDriverPayments(getDriverPaymentsDto:GetDriverPaymentsDto){
    //get the list of unpaid orders
    const orders=await this.closedOrdersService.findAll({driverId:getDriverPaymentsDto.driverId});

    //get the driver
    const driver =await this.driversService.getOneIfExist({id:getDriverPaymentsDto.driverId});


    return {
      orders:orders,
      driverName:`${driver.firstName} ${driver.lastName}`,
      driverNumber:driver.user.phoneNumber
    }
  }

  async payOrder(payOrderDto:PayOrderDto){
    for (const orderId of payOrderDto.orderIds) {
      await this.closedOrdersService.update({ id: orderId, isPaid: 1 });
    }
    return {};
  }

  async updateProfit(updateProfitDto:UpdateProfitDto){
    await this.profitRepository.update({id:1},{CompanyProfitPercentage:updateProfitDto.newProfitPercentage});

    return {}
  }
}
