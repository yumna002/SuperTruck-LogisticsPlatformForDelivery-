import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';
import { ClosedOrdersModule } from '../closed-orders/closed-orders.module';
import { Profit } from './entities/profit.entity';



@Module({
  imports: [UsersModule,forwardRef(()=>DriversModule),ClosedOrdersModule, TypeOrmModule.forFeature([PaymentType]),TypeOrmModule.forFeature([Profit])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService]
})
export class PaymentsModule {}
