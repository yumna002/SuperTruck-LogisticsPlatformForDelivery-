import { forwardRef, Module } from '@nestjs/common';
import { ScheduledOrdersService } from './scheduled-orders.service';
import { ScheduledOrdersController } from './scheduled-orders.controller';
import { UsersModule } from '../users/users.module';
import { CustomersModule } from '../customers/customers.module';
import { DriversModule } from '../drivers/drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledOrder } from './entities/scheduled-order.entity';
import { OrdersModule } from '../orders/orders.module';
import { ProcessingOrdersModule } from '../processing-orders/processing-orders.module';
import { NotificationsModule } from '../notifications/notifications.module';



@Module({
  imports:[UsersModule, NotificationsModule, forwardRef(()=>DriversModule),CustomersModule,forwardRef(()=>OrdersModule),forwardRef(()=>ProcessingOrdersModule), forwardRef(()=>DriversModule),TypeOrmModule.forFeature([ScheduledOrder])],
  controllers: [ScheduledOrdersController],
  providers: [ScheduledOrdersService],
  exports: [ScheduledOrdersService]
})
export class ScheduledOrdersModule {}
