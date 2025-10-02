import { Module } from '@nestjs/common';
import { PendingOrdersService } from './pending-orders.service';
import { PendingOrdersController } from './pending-orders.controller';
import { PendingOrder } from './entities/pending-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '../drivers/entities/driver.entity';



@Module({
  imports:[TypeOrmModule.forFeature([Driver]),TypeOrmModule.forFeature([PendingOrder])],
  controllers: [PendingOrdersController],
  providers: [PendingOrdersService],
  exports: [PendingOrdersService]
})
export class PendingOrdersModule {}
