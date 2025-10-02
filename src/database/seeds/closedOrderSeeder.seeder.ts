import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClosedOrder } from 'src/modules/closed-orders/entities/closed-order.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ClosedOrderSeeder {
  constructor(
    @InjectRepository(ClosedOrder) private closedOrderRepository: Repository<ClosedOrder>,
  ) {}

  async run() {
    await this.closedOrderRepository.save([
      {
        expectedPrice:200000,
        finalPrice:210000,
        finalDriverPrice:150000,
        finalHolderPrice:30000,
        finalDistance:0,
        finalTime:0,
        isPaid:0,
        order:{id:4},
        driver:{id:1}
      },
      {
        expectedPrice:150000,
        finalPrice:140000,
        finalDriverPrice:100000,
        finalHolderPrice:15000,
        finalDistance:0,
        finalTime:0,
        isPaid:0,
        order:{id:5},
        driver:{id:1}
      },
    ]);
  }
}
