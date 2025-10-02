import { ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { paginate } from 'src/shared/utils/paginateFunction';
import { UpdateDto } from './dto/update.dto';
import { CreateDto } from './dto/create.dto';
import { SwitchMyOnlineStateDto } from './dto/swithMyOnlineState.dto';
import { TrucksService } from '../trucks/trucks.service';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { UserTypeEnum } from 'src/common/enums/userType';
import { Transactional } from 'typeorm-transactional';
import { Order } from '../orders/entities/order.entity';
import { TruckModelsService } from '../truck-models/truck-models.service';
import { DriverGateway } from './driver.gateway';
import { response } from 'express';
import { MatchOrderDriverDto } from './dto/matchOrderDriver.dto';
import { PendingOrdersService } from '../pending-orders/pending-orders.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { plainToInstance } from 'class-transformer';
import { SendOrderRequestDto } from '../orders/dto/sendOrderRequest.dto';
import { RejectedOrdersService } from '../rejected-orders/rejected-orders.service';
import { ProcessingOrdersService } from '../processing-orders/processing-orders.service';
import { getNeighbors } from 'src/shared/utils/geohashFunctions';
import { all } from 'axios';
import { ScheduledOrdersService } from '../scheduled-orders/scheduled-orders.service';
import { formatToDbDateTime } from 'src/shared/utils/formatToDbDateTime';
import { geohashDrivers, driverGeohash, driverNowLocation } from 'src/common/providers/global-cache/globalCache.provider';



@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    private readonly usersService: UsersService,
    private readonly trucksService:TrucksService,
    private readonly truckModelsService : TruckModelsService,
    private readonly driverGateway:DriverGateway,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly pendingOrdersService:PendingOrdersService,
    private readonly rejectedOrdersService:RejectedOrdersService,
    private readonly processingOrdersService:ProcessingOrdersService,
    private readonly scheduledOrdersService:ScheduledOrdersService,
    @Inject(REQUEST) private request: Request,
  ) {}


  @Transactional()
  async create(createDto: CreateDto) {
    const isExist=await this.isExist({nationalNumber:createDto.nationalNumber});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const role=await this.usersService.getOneRoleIfExist({name:RoleTypeEnum.DRIVER});

    const newUser=await this.usersService.createUser({
      phoneNumber:createDto.phoneNumber,
      userType:UserTypeEnum.DRIVER,
      password:null,
      roleId:role.id
    });

    const newDriver=await this.driverRepository.save({
      firstName:createDto.firstName,
      lastName:createDto.lastName,
      fatherName:createDto.fatherName,
      nationalNumber:createDto.nationalNumber,
      gender:createDto.gender,
      city:createDto.city,
      address:createDto.address,
      birthdate:createDto.birthdate,
      rate:0,
      extraProfit:0,
      rateSum:0,
      rateCount:0,
      isAvailable:0,
      isOnline:0,
      user:{id:newUser.id}
    });

    return newDriver;
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.driverRepository.createQueryBuilder('driver');

    //qb.innerJoin('driver.user', 'user');
    qb.leftJoin('driver.user', 'user').addSelect(['user.phoneNumber', 'user.isActive']);

    
    if(findAllDto.isActive!=null) {
      qb.andWhere('user.isActive = :isActive', { isActive: findAllDto.isActive });    
    }

    if(findAllDto.isOnline!=null) {
      qb.andWhere('user.isOnline = :isOnline', { isOnline: findAllDto.isOnline });    
    }

    if (findAllDto.name!=null) {
      qb.andWhere('(driver.firstName LIKE :name OR driver.lastName LIKE :name)',{ name: `%${findAllDto.name}%` });      
    }

    if(findAllDto.isAvailable!=null) {
      qb.andWhere('user.isAvailable = :isAvailable', { isAvailable: findAllDto.isAvailable });    
    }

    return await paginate(qb, {page:findAllDto.page, limit:findAllDto.limit});
  }

  async findOne(findOneDto: FindOneDto):Promise<Driver|null> {
    const qb = this.driverRepository.createQueryBuilder('driver');
    qb.leftJoinAndSelect('driver.user','user');
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('driver.id = :id', { id: findOneDto.id });
    }
    if(findOneDto.userId!=null){
      ok=0;
      qb.andWhere('driver.userId = :userId', { userId: findOneDto.userId });
    }
    if(findOneDto.nationalNumber!=null){
      ok=0;
      qb.andWhere('driver.nationalNumber = :nationalNumber', { nationalNumber: findOneDto.nationalNumber });
    }

    if(ok)return null;
    
    return await qb.getOne();
  }

  async update(updateDto:UpdateDto) {
    const driver = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach(async (key) => {
      if (updateDto[key] != null && key !== 'id') {
        if(key == 'phoneNumber'){
          await this.usersService.update({id:driver.userId,phoneNumber:updateDto.phoneNumber});
        }
        else{
          driver[key] = updateDto[key];
        }
      }
    });

    await this.driverRepository.save(driver);
    return driver;
  }
  
  async getCurrentDriver():Promise<Driver> {
    const driver=await this.findOne({userId:this.request['userId']});
    if(!driver){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return driver;
  }

  @Transactional()
  async switchMyOnlineState(switchMyOnlineStateDto:SwitchMyOnlineStateDto) {
    const driver=await this.getCurrentDriver();
    const newState=driver.isOnline^1;

    console.log('driver:',driver)
    console.log('newState',newState);

    //if change to online
    if(newState){
      console.log(switchMyOnlineStateDto);

      //update the truck first to make sure there is a turck with this id
      if(!switchMyOnlineStateDto.truckId){
        throw new Error(I18nKeys.validationMessages.isNotEmpty);
      }
      console.log('update truck')
      await this.trucksService.update({id:switchMyOnlineStateDto.truckId,isAvailable:newState});
      
      console.log('update driver')
      //update the driver online
      await this.update({id:driver.id,isOnline:newState,isAvailable:newState}); 
    }
    else{//if change to offline
      //if the driver is currently in  atrip , he can't change his state
      if(!driver.isAvailable){
        throw new Error(I18nKeys.exceptionMessages.onlineOfflineException);
      }
      console.log('driver offline')

      //first get the online truck 
      //find it first because if not exist to need to throw an error
      const truck=await this.trucksService.findOne({driverId:driver.id,isAvailable:1});
      if(truck){
        console.log('truck',truck)
        await this.trucksService.update({id:truck.id,isAvailable:newState});
      }
      await this.update({id:driver.id,isOnline:newState,isAvailable:newState});
    }

    return {newState:newState};
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<Driver> {
    const driver=await this.findOne(findOneDto);
    console.log('id= ',findOneDto.id)
    console.log(driver)
    if(!driver){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return driver;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const driver=await this.findOne(findOneDto);
    if(!driver)return false;
    else return true;
  }

  async updateDriverTracking(orderId:number, d:number, tt:number) {
    this.processingOrdersService.update({id:orderId,currDistance:d,currTime:tt}); //must not be await
  }

  //@Transactional()
  async matchOrderDriver(matchOrderDriverDto:MatchOrderDriverDto){

    const triedDrivers = new Set<number>();
    const maxRetries = 3;
    let attempts = 0;

    while (attempts < maxRetries) {
      //get the order again to check if it was cancelled
      const order=await this.ordersService.findOne({id:matchOrderDriverDto.order.id})
      if(order?.state!=OrderStateEnum.PENDING){
        break;
      }

      //get the list of suitable drivers 
      const drivers = await this.getSuitableDriversList(matchOrderDriverDto.order);
      const nextDriver = drivers.find(d => !triedDrivers.has(d));
      if (!nextDriver) {
        break; //No more untried drivers
      }
      triedDrivers.add(nextDriver);
      attempts++;

      const orderRequst={
        order:matchOrderDriverDto.order,
        confirmOrder:{
          expectedTime:matchOrderDriverDto.expectedTime,
          expectedPrice:matchOrderDriverDto.expectedPrice,
          distance:matchOrderDriverDto.distance,
          driverProfit:matchOrderDriverDto.driverProfit,
          holdersProfit:matchOrderDriverDto.holdersProfit
        }
      }

      const sendOrderRequestDto = plainToInstance(SendOrderRequestDto, orderRequst, {
          excludeExtraneousValues: true,
      });
      sendOrderRequestDto.customerId=order.customerId;

      //add driverId to the request
      sendOrderRequestDto.driverId=nextDriver

      //send request to driver
      this.driverGateway.sendOrderRequest(nextDriver,sendOrderRequestDto)
      
      //wait for driver response
      const response = await this.driverGateway.waitForDriverResponse(matchOrderDriverDto.order.id)!;

      

      //if order was accepted
      if (response.accepted) {
        //get the driver truckId

        const truck=await this.trucksService.getOneIfExist({driverId:nextDriver,sizeTypeId:order.sizeTypeId,vehicleTypeId:order.vehicleTypeId})

        return {accepted:true,driverId:nextDriver,truckId:truck.id};
      }
      else if(!response?.accepted){
        //add that driver rejected this order
        const rejectedOrder=await this.rejectedOrdersService.create({
          orderId:matchOrderDriverDto.order.id,
          driverId:nextDriver,
          rejectReasonId:response.rejectReasonId!
        })

        //try to find a differnt driver
      }
    }
    //no driver was found 
    return {accepted:false,driverId:0,truckId:0};
  }

  async getSuitableDriversList(order:Order){
    //get the right truck model
    const truckModels=await this.truckModelsService.findAll({vehicleTypeId:order.vehicleTypeId,sizeTypeId:order.sizeTypeId});
    const truckModelIds = truckModels.map(model => model.id);

    console.log(truckModelIds);

    //get all trucks with suitable truck model
    const trucks=await this.trucksService.findAll({truckModelIds})

    console.log(trucks);
    //Extract driver IDs from the trucks
    const driverIds = trucks
      .map(truck => truck.driverId)
      .filter((id): id is number => id != null); // Filters out null/undefined

    console.log(driverIds);
    //remove duplicates
    const uniqueDriverIds = [...new Set(driverIds)];

    //remove offline or not free at the time
    const driversList:number[]=[]
    for(const driverId of uniqueDriverIds){
      //check if online
      const driver=await this.getOneIfExist({id:driverId})
      if(!driver.isOnline)
        continue;

      //check if free
      //check if free
      const startDateTime = new Date(order.orderDateTime);
      startDateTime.setHours(startDateTime.getHours() - 3);

      const endDateTime = new Date(order.orderDateTime);
      endDateTime.setHours(endDateTime.getHours() + 3);
      
      const scheduledOrder=await this.scheduledOrdersService.findOne({driverId:driverId,startDateTime:startDateTime.toISOString(),endDateTime:endDateTime.toISOString()})

      console.log(scheduledOrder);
      if(scheduledOrder!=null)
        continue;

      driversList.push(driverId);
    }

    // Shuffle drivers list
    for (let i = driversList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [driversList[i], driversList[j]] = [driversList[j], driversList[i]];
    }

    return driversList;
  }

  async getTopTenRatedDrivers(){
    const drivers = await this.driverRepository
    .createQueryBuilder('driver')
    .orderBy('driver.rate', 'DESC')
    .limit(10)
    .getMany();

    console.log(drivers);
    return drivers
  }

  async getDriverSocketConnections(){
    return await this.driverGateway.getSocketConnections();
  }

  async getGeoHash(){
    return this.driverGateway.getGeoHash();
  }
}
