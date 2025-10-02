import { Module } from '@nestjs/common';
import { RejectedOrdersService } from './rejected-orders.service';
import { RejectedOrdersController } from './rejected-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RejectedOrder } from './entities/rejected-order.entity';
import { RejectReason } from './entities/reject-reason.entity';
import { UsersModule } from '../users/users.module';



@Module({
  imports:[UsersModule,TypeOrmModule.forFeature([RejectedOrder]),TypeOrmModule.forFeature([RejectReason])],
  controllers: [RejectedOrdersController],
  providers: [RejectedOrdersService],
  exports: [RejectedOrdersService]
})
export class RejectedOrdersModule {}
