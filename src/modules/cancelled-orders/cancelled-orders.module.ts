import { Module } from '@nestjs/common';
import { CancelledOrdersService } from './cancelled-orders.service';
import { CancelledOrdersController } from './cancelled-orders.controller';

@Module({
  controllers: [CancelledOrdersController],
  providers: [CancelledOrdersService],
})
export class CancelledOrdersModule {}
