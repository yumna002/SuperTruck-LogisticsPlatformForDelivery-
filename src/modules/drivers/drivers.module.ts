import { forwardRef, Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { TrucksModule } from '../trucks/trucks.module';
import { TruckModelsModule } from '../truck-models/truck-models.module';
import { DriverGateway } from './driver.gateway';
import { PendingOrdersModule } from '../pending-orders/pending-orders.module';
import { OrdersModule } from '../orders/orders.module';
import { CustomersModule } from '../customers/customers.module';
import { RejectedOrdersModule } from '../rejected-orders/rejected-orders.module';
import { ProcessingOrdersModule } from '../processing-orders/processing-orders.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { ProcessingOrder } from '../processing-orders/entities/processing-order.entity';
import { ScheduledOrdersModule } from '../scheduled-orders/scheduled-orders.module';



@Module({
  imports: [UsersModule, ProcessingOrdersModule, TruckModelsModule, TrucksModule,CustomersModule,PendingOrdersModule,ScheduledOrdersModule, RejectedOrdersModule, forwardRef(()=>OrdersModule), TypeOrmModule.forFeature([ProcessingOrder]), TypeOrmModule.forFeature([Driver])],
  controllers: [DriversController],
  providers: [DriversService, DriverGateway],
  exports: [DriversService,DriverGateway]
})
export class DriversModule {}
