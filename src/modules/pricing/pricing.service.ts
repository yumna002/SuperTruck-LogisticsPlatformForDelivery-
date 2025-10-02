import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetExpectedTimeAndPriceDto } from './dto/getExpectedTimeAndPrice.dto';
import { OrdersService } from '../orders/orders.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { GetFinalPriceDto } from './dto/getFinalPrice.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pricing } from './entities/pricing.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { GoogleMapsService } from 'src/integrations/google-maps/google-maps.service';
import { AddressesService } from '../addresses/addresses.service';
import { convertToHoursAndMinutes } from 'src/shared/utils/timeInHourFunction';
import { GeneratePricesDto } from './dto/generatePrices.dto';
import { GetFinalDistanceAndTimeDto } from './dto/getFinalDistanceAndTime.dto';
import { ClosedOrdersService } from '../closed-orders/closed-orders.service';
import { FindOneDto } from './dto/findOne.dto';
import { Profit } from '../payments/entities/profit.entity';
import { GetTimeAndDistaceDto } from './dto/getTimeAndDistace.dto';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { TruckModelsService } from '../truck-models/truck-models.service';
import { ProcessingOrdersService } from '../processing-orders/processing-orders.service';
import { ItemsService } from '../items/items.service';
import { ItemSizeEnum } from 'src/common/enums/itemSize';
import { DriversService } from '../drivers/drivers.service';
import { PaymentsService } from '../payments/payments.service';



@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing) private readonly pricingRepository: Repository<Pricing>,
    private readonly googleMapsService:GoogleMapsService,
    private readonly addressesService:AddressesService,
    private readonly itemsService:ItemsService,
    @Inject(forwardRef(() => PaymentsService)) private readonly paymentsService: PaymentsService,
    @Inject(forwardRef(() => DriversService)) private readonly driversService: DriversService,
    private readonly truckModelsService:TruckModelsService,
    @Inject(forwardRef(() => ProcessingOrdersService)) private readonly processingOrdersService: ProcessingOrdersService,
    @Inject(REQUEST) private request: Request,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {}

  
  async getExpectedTimeAndPriceAndDistance(getExpectedTimeAndPriceDto:GetExpectedTimeAndPriceDto) {
    const order=await this.ordersService.getOneIfExist({id:getExpectedTimeAndPriceDto.orderId});
   
    const allowedNullFields = ['paymentType','paymentTypeId'];
    const hasUnexpectedNulls = Object.entries(order).some(([key, value]) => {
      return !allowedNullFields.includes(key) && value === null;
    });

    if (hasUnexpectedNulls) {
      throw new BadRequestException(I18nKeys.exceptionMessages.noNullValuesBadRequestException);
    }

    const st=await this.addressesService.getOneIfExist({id:order.fromAddressId});
    const en=await this.addressesService.getOneIfExist({id:order.toAddressId});

    const expectedTimeAndDistace=await this.getTimeAndDistace({latitudeSt:st.latitude,longitudeSt:st.longitude,latitudeEn:en.latitude,longitudeEn:en.longitude});
    const expectedTime=await convertToHoursAndMinutes(expectedTimeAndDistace.time);
    const expectedPrices=await this.generatePrices({
      distance:expectedTimeAndDistace.distance,
      orderId:order.id
    });

    return {
      expectedTime:expectedTime,
      distance:expectedTimeAndDistace.distance,
      expectedPrice:expectedPrices.totalPrice,
      expectedHoldersProfit:expectedPrices.holdersPrice,
      expectedDirverProfit:expectedPrices.dirverPrice
    };
  }

  async getTimeAndDistace(getTimeAndDistaceDto:GetTimeAndDistaceDto) {
    const origin = getTimeAndDistaceDto.latitudeSt.toString()+","+getTimeAndDistaceDto.longitudeSt.toString(); // start (lat,lng)
    const destination = getTimeAndDistaceDto.latitudeEn.toString()+","+getTimeAndDistaceDto.longitudeEn.toString(); // end (lat,lng)

    const response = await this.googleMapsService.getTimeAndDistace(origin,destination);

    const leg = response.routes[0].legs[0];
    const distance=leg.distance.value/1000; //in km
    const time= leg.duration.value; //in seconds
    
    return {
      time: time, 
      distance: distance 
    };
  }

  async generatePrices(generatePricesDto:GeneratePricesDto) {
    const formula = await this.pricingRepository.findOneBy({id:1});
    if(!formula){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }

    //constants & variables
    let distance=generatePricesDto.distance;
    let truckFuelConsumption=0.3; //default value 
    let fuelLiterPrice=(await this.truckModelsService.getFuelTypeByIdIfExist(1)).price; //gasoline is default
    let FloorsNumberSt=0;
    let FloorsNumberEn=0;
    let needHolders=0;
    let itemsWeight=0; //in kg
    
    //get order
    const order=await this.ordersService.getOneIfExist({id:generatePricesDto.orderId});
    FloorsNumberSt=order.fromFloorNumber;
    FloorsNumberEn=order.toFloorNumber;
    needHolders=order.needHolders;
    
    let holdersTotal=0;
    
    //for all items
    const items=await this.itemsService.findAll({orderId:order.id});
    
    //at st
    for(let item of items){
      let itemWeight=item.itemWeight.name_en;
      if(itemWeight===ItemSizeEnum.SMALL)itemsWeight+=formula.highestValueSmallWeight;
      else if(itemWeight===ItemSizeEnum.MEDIUM)itemsWeight+=formula.highestValueMediumWeight;
      else itemsWeight+=100;

      //for workers
      let X=0;//price for getting item on first floor
      if(itemWeight===ItemSizeEnum.SMALL)X=formula.firstFloorPrice;
      else if(itemWeight===ItemSizeEnum.MEDIUM)X=formula.firstFloorPrice+(formula.firstFloorPrice/2);
      else X=formula.firstFloorPrice+formula.firstFloorPrice;

      let x=X;
      let section=FloorsNumberSt/3;
      let addToHolders=0;
      let add=0; if(section%2==0)add=((50*x)/100);
      addToHolders+=(3*((Math.ceil(section/2)*x)+add));
      let rest=FloorsNumberSt%3;
      addToHolders+=(rest*x);

      if(order.fromHaveLift)addToHolders=X;
      holdersTotal+=addToHolders;
    }

    itemsWeight=0;

    //at en
    for(let item of items){
      let itemWeight=item.itemWeight.name_en;
      if(itemWeight===ItemSizeEnum.SMALL)itemsWeight+=formula.highestValueSmallWeight;
      else if(itemWeight===ItemSizeEnum.MEDIUM)itemsWeight+=formula.highestValueMediumWeight;
      else itemsWeight+=100;

      //for workers
      let X=0;//price for getting item on first floor
      if(itemWeight===ItemSizeEnum.SMALL)X=formula.firstFloorPrice;
      else if(itemWeight===ItemSizeEnum.MEDIUM)X=formula.firstFloorPrice+(formula.firstFloorPrice/2);
      else X=formula.firstFloorPrice+formula.firstFloorPrice;

      let x=X;
      let section=FloorsNumberEn/3;
      let addToHolders=0;
      let add=0; if(section%2==0)add=((50*x)/100);
      addToHolders+=(3*((Math.ceil(section/2)*x)+add));
      let rest=FloorsNumberEn%3;
      addToHolders+=(rest*x);

      if(order.toHaveLift)addToHolders=X;
      holdersTotal+=addToHolders;
    }

    holdersTotal=Math.max(holdersTotal,30000);
    holdersTotal=Math.min(holdersTotal,needHolders*100000);

    if(order.state===OrderStateEnum.DRAFT){} //do nothing
    else{
      const processingOrder=await this.processingOrdersService.getOneIfExist({id:order.id});
      const truckModel=await this.truckModelsService.getOneTruckModelIfExist({id:processingOrder.truck.truckModelId});

      truckFuelConsumption=truckModel.fuelConsumption;

      const fuel=await this.truckModelsService.getFuelTypeByIdIfExist(truckModel.fuelTypeId);
      fuelLiterPrice=fuel.price;
    }

    console.log('truckFuelConsumption',truckFuelConsumption);
    console.log('fuelLiterPrice',fuelLiterPrice);
    
    //for truck
    let fuelConsumption=(distance*truckFuelConsumption)*fuelLiterPrice;
    console.log('fuelConsumption',fuelConsumption)

    if(itemsWeight<=formula.highestValueSmallWeight){}//do not do anything
    else if(itemsWeight<=formula.highestValueMediumWeight)fuelConsumption+=((formula.increaseRateMediumWeight*fuelConsumption)/100);//or 20
    else if(itemsWeight>formula.highestValueMediumWeight)fuelConsumption+=((formula.increaseRateHeavyWeight*fuelConsumption)/100);//or 30

    console.log('fuelConsumption',fuelConsumption)

    fuelConsumption=Math.max(fuelConsumption,40000);
    const netProfit=((formula.netProfit*fuelConsumption)/100); //or 60 
    let driverTotal=fuelConsumption+netProfit;

    //driverTotal=Math.max(driverTotal,75000);
    //driverTotal=Math.min(driverTotal,200000);

    const totalPrice=driverTotal+holdersTotal;

    console.log('in generate prices:');
    console.log('totalPrice',totalPrice);
    console.log('holdersPrice',holdersTotal);
    console.log('driverPrice',driverTotal);
    console.log('net profit',netProfit);
    
    return {
      totalPrice:totalPrice,
      holdersPrice:holdersTotal,
      dirverPrice:driverTotal,
      netProfit:netProfit
    };
  }

  async getFinalDistanceAndTime(getFinalDistanceAndTimeDto:GetFinalDistanceAndTimeDto) {
    const processingOrder=await this.processingOrdersService.getOneIfExist({id:getFinalDistanceAndTimeDto.orderId});

    const finalDistance=processingOrder.currDistance;
    const finalTime=processingOrder.currTime;

    return {
      finalDistance:finalDistance,
      finalTime:finalTime
    };
  }

  async getFinalPrice(getFinalPriceDto:GetFinalPriceDto){
    const order=await this.ordersService.getOneIfExist({id:getFinalPriceDto.orderId});
    const processingOrder=await this.processingOrdersService.getOneIfExist({id:getFinalPriceDto.orderId});

    const finalTimeAndDistace=await this.getFinalDistanceAndTime({orderId:order.id});
    const finalPrices=await this.generatePrices({
      distance:finalTimeAndDistace.finalDistance,
      orderId:order.id
    });

    console.log('finalPrices in get finla price ',finalPrices);

    const driver=await this.driversService.getOneIfExist({id:processingOrder.driverId});
    const generalProfitPercentage=await this.paymentsService.getGeneralProfitPercentage();

    let driverProfit=(finalPrices.dirverPrice-finalPrices.netProfit)+((finalPrices.netProfit*(100-generalProfitPercentage+driver.extraProfit))/100);
    console.log('driverProfit',driverProfit)
    return {
      totalPrice:finalPrices.totalPrice,
      driverProfit:driverProfit, //just his profit without company
      holdersProfit:finalPrices.holdersPrice
    }
  }

  async update(updateDto:UpdateDto) {
    const formula = await this.pricingRepository.findOneBy({id:updateDto.id});
    if(!formula){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        formula[key] = updateDto[key];
      }
    });

    await this.pricingRepository.save(formula);
    return formula;
  }

  async findOne(findOneDto:FindOneDto){
    const qb=this.pricingRepository.createQueryBuilder('pricing');
    
    let ok=1; 

    if(findOneDto.id != null){
      ok=0;
      qb.andWhere('pricing.id=:id',{id:findOneDto.id})
    }

    if (ok) return null;

    return await qb.getOne();
  }

  
}
