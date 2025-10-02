import { forwardRef, Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { OrderQueueScheduler } from './order-queue.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { PriorityQueue } from 'src/shared/data-structures/priority-queue';
import { OrderObj } from 'src/common/types/orderObj.interface';
import { DriversModule } from 'src/modules/drivers/drivers.module';
import { compare } from 'src/shared/utils/matchingCompareFunction';
import { TryModule } from 'src/try/try.module';
import { UsersModule } from 'src/modules/users/users.module';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from 'src/modules/trucks/entities/truck.entity';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { SizeType } from 'src/modules/truck-models/entities/size-type.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { PendingOrder } from 'src/modules/pending-orders/entities/pending-order.entity';
import { CustomersModule } from 'src/modules/customers/customers.module';
import { RejectedOrder } from 'src/modules/rejected-orders/entities/rejected-order.entity';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { GoogleMapsModule } from 'src/integrations/google-maps/google-maps.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';



@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(()=>DriversModule),
    forwardRef(()=>CustomersModule),
    TypeOrmModule.forFeature([Driver]),
    TypeOrmModule.forFeature([Truck]),
    TypeOrmModule.forFeature([TruckModel]),
    TypeOrmModule.forFeature([SizeType]),
    TypeOrmModule.forFeature([VehicleType]),
    TypeOrmModule.forFeature([PendingOrder]),
    TypeOrmModule.forFeature([RejectedOrder]),
    TypeOrmModule.forFeature([ProcessingOrder]),
    TypeOrmModule.forFeature([Order]),
    GoogleMapsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'ORDER_QUEUE',
      useFactory: () => {
        return new PriorityQueue<OrderObj>(compare); //shared instance
      },
    },
    SchedulerService,
    OrderQueueScheduler
  ],
  exports: ['ORDER_QUEUE', SchedulerService]
})
export class SchedulerModule {}
