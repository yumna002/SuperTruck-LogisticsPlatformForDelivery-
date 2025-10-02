import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { ScheduledOrder } from 'src/modules/scheduled-orders/entities/scheduled-order.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ScheduledOrderSeeder {
  constructor(
    @InjectRepository(ScheduledOrder) private scheduledOrderRepository: Repository<ScheduledOrder>,
  ) {}

  async run() {
    await this.scheduledOrderRepository.save([
      {
        order:{id:6},
        driver:{id:1},
        truck:{id:2},
        expectedPrice:100000,
        expectedTime:0
      },
      {
        order:{id:10},
        driver:{id:1},
        truck:{id:2},
        expectedPrice:130000,
        expectedTime:0
      },
    ]);
  }
}
