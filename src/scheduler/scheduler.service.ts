import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PriorityQueue } from 'src/shared/data-structures/priority-queue';
import { OrderObj } from 'src/common/types/orderObj.interface';
import { geohashEncode, getNeighbors } from 'src/shared/utils/geohashFunctions';
import { AddNewOrderDto } from './dto/addNewOrder.dto';
import { geohashDrivers, driverGeohash } from 'src/common/providers/global-cache/globalCache.provider';
import { DriverGateway } from 'src/modules/drivers/driver.gateway';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { Truck } from 'src/modules/trucks/entities/truck.entity';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { SizeType } from 'src/modules/truck-models/entities/size-type.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { PendingOrder } from 'src/modules/pending-orders/entities/pending-order.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { CustomerGateway } from 'src/modules/customers/customer.gateway';



interface OrderMeta {
  orderId: number;
  geoHash: string;
  attempts: number;
  timestamp: number;
}


@Injectable()
export class SchedulerService {    
  private maxAttempts=2;

  constructor(
    @Inject('ORDER_QUEUE') private readonly priorityQueue: PriorityQueue<OrderObj>,
    @InjectRepository(Driver) private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Truck) private readonly truckRepository: Repository<Truck>,
    @InjectRepository(TruckModel) private readonly truckModelRepository: Repository<TruckModel>,
    @InjectRepository(SizeType) private readonly sizeTypeRepository: Repository<SizeType>,
    @InjectRepository(VehicleType) private readonly vehicleTypeRepository: Repository<VehicleType>,
    @InjectRepository(PendingOrder) private readonly pendingOrderRepository: Repository<PendingOrder>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly customerGateway: CustomerGateway,
  ) {}


  async addNewOrder(addNewOrderDto:AddNewOrderDto) {
    //push new orders into the queue
    //calc geo hash of the order
    const geoHash= await geohashEncode(addNewOrderDto.latitude,addNewOrderDto.longitude);
    this.addToQueue({
      numberOfAttempts: 0,
      timeStamp: new Date(),
      orderId: addNewOrderDto.orderId,
      order: addNewOrderDto.order,
      sendOrderRequestDto:addNewOrderDto.sendOrderRequestDto,
      geoHash: geoHash,
      rejectedDrivers: []
    });
  }

  async addToQueue(order:OrderObj) {
    if(order.numberOfAttempts>this.maxAttempts){
      //return it to draft
      const orderInfo=await this.orderRepository.findOneBy({id:order.orderId});
      if(!orderInfo){
        throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
      }
      orderInfo.state=OrderStateEnum.DRAFT;
      await this.orderRepository.save(orderInfo);

      //notify customer
      this.customerGateway.sendOrderStatusUpdate(order.order.customerId,{orderId:order.orderId,accepted:false});

      return;
    }
    order.numberOfAttempts*=-1;
    this.priorityQueue.push(order);
  }

  async getNearbyDrivers(orders: OrderObj[]) {
    let allSuitableDrivers=new Set<number>();

    for(let order of orders){
      let allAreas=new Set<string>();

      allAreas.add(order.geoHash);
      let neighbors=await getNeighbors(order.geoHash);
      for(let n of neighbors)
        allAreas.add(n);

      for(let area of allAreas){
        console.log('area= ',area);

        let drivers=await this.getSuitableDriversFromArea(area,order.order.sizeTypeId,order.order.vehicleTypeId);
         console.log('drivers= ',drivers);
        for(let d of drivers)
          allSuitableDrivers.add(d);
      }
    }

    return allSuitableDrivers;
  }

  async getSuitableDriversFromArea(area: string, sizeTypeId:number, vehicleTypeId:number) {
    let drivers=geohashDrivers.get(area);
    if(!drivers)return [];

    let allDrivers=new Set<number>();
    for(let driver of drivers){
      allDrivers.add(driver);
    }

    let allSuitableDrivers=new Set<number>();

    for(let d of allDrivers){
      const driver=await this.driverRepository.findOneBy({id:d});
      if(!driver)continue;
      //driver check
      if(driver.isOnline===0 || driver.isAvailable===0)continue;

      //truck check
      const truck = await this.truckRepository
      .createQueryBuilder("truck")
      .leftJoinAndSelect("truck.truckModel", "truckModel")
      .leftJoinAndSelect("truckModel.sizeType", "sizeType")
      .leftJoinAndSelect("truckModel.vehicleType", "vehicleType")
      .where("truck.driverId = :driverId", { driverId: d })
      .andWhere("sizeType.id = :sizeTypeId", { sizeTypeId: sizeTypeId })
      .andWhere("vehicleType.id = :vehicleTypeId", { vehicleTypeId: vehicleTypeId })
      .andWhere("truck.isAvailable = :isAvailable", { isAvailable: 1 })
      .getOne();

      if(!truck)continue;

      allSuitableDrivers.add(d);
    }

    return allSuitableDrivers;
  }
}
