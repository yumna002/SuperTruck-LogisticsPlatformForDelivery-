import { forwardRef, Module } from '@nestjs/common';
import { ProcessingOrdersService } from './processing-orders.service';
import { ProcessingOrdersController } from './processing-orders.controller';
import { CustomersModule } from '../customers/customers.module';
import { ProcessingOrder } from './entities/processing-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PricingModule } from '../pricing/pricing.module';
import { DriversModule } from '../drivers/drivers.module';
import { NotificationsModule } from '../notifications/notifications.module';



@Module({ 
  imports: [ UsersModule, NotificationsModule,CustomersModule,forwardRef(()=>DriversModule), forwardRef(()=>PricingModule), TypeOrmModule.forFeature([ProcessingOrder])],
  controllers: [ProcessingOrdersController],
  providers: [ProcessingOrdersService],
  exports : [ProcessingOrdersService]
})
export class ProcessingOrdersModule {}
