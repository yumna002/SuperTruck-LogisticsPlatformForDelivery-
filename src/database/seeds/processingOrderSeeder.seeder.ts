import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessingOrderStateEnum } from 'src/common/enums/processingOrderState';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ProcessingOrderSeeder {
  constructor(
    @InjectRepository(ProcessingOrder) private processingOrderRepository: Repository<ProcessingOrder>,
  ) {}

  async run() {
    await this.processingOrderRepository.save([
    ]);
  }
}
