import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from './entities/rate.entity';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { ClosedOrdersModule } from '../closed-orders/closed-orders.module';
import { DriversModule } from '../drivers/drivers.module';



@Module({
  imports:[UsersModule,ClosedOrdersModule,DriversModule, TypeOrmModule.forFeature([Rate])],
  controllers: [RatesController],
  providers: [RatesService],
  exports: [RatesService]
})
export class RatesModule {}
