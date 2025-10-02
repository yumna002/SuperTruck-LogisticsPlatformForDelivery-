import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/modules/rates/entities/rate.entity';
import { RejectedOrder } from 'src/modules/rejected-orders/entities/rejected-order.entity';
import { Repository } from 'typeorm';



@Injectable()
export class RejectedOrderSeeder {
  constructor(
    @InjectRepository(RejectedOrder) private rejectedOrderRepository: Repository<RejectedOrder>,
  ) {}

  async run() {
    await this.rejectedOrderRepository.save([
      {
        driver:{id:1},
        order:{id:7},
        rejectReason:{id:1}
      },
      {
        driver:{id:2},
        order:{id:7},
        rejectReason:{id:2}
      },
    ]);
  }
}
