import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CustomersModule } from '../customers/customers.module';
import { ClosedOrdersModule } from '../closed-orders/closed-orders.module';
import { ProcessingOrdersModule } from '../processing-orders/processing-orders.module';
import { ItemsModule } from '../items/items.module';
import { DriversModule } from '../drivers/drivers.module';
import { Photo } from './entities/photo.entity';
import { PendingOrder } from '../pending-orders/entities/pending-order.entity';
import { PendingOrdersModule } from '../pending-orders/pending-orders.module';
import { TrucksModule } from '../trucks/trucks.module';
import { ScheduledOrdersModule } from '../scheduled-orders/scheduled-orders.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';



@Module({
  imports: [UsersModule, forwardRef(()=>SchedulerModule),CustomersModule,forwardRef(()=>DriversModule),TrucksModule, ItemsModule,ClosedOrdersModule,ProcessingOrdersModule,PendingOrdersModule,forwardRef(()=>ScheduledOrdersModule), TypeOrmModule.forFeature([Order]),TypeOrmModule.forFeature([Photo])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
