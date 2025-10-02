import { forwardRef, Module } from '@nestjs/common';
import { ClosedOrdersService } from './closed-orders.service';
import { ClosedOrdersController } from './closed-orders.controller';
import { UsersModule } from '../users/users.module';
import { CustomersModule } from '../customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClosedOrder } from './entities/closed-order.entity';
import { DriversModule } from '../drivers/drivers.module';



@Module({
  imports : [UsersModule,CustomersModule,forwardRef(() => DriversModule), TypeOrmModule.forFeature([ClosedOrder])],
  controllers: [ClosedOrdersController],
  providers: [ClosedOrdersService],
  exports : [ClosedOrdersService]
})
export class ClosedOrdersModule {}
