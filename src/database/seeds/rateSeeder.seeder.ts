import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/modules/rates/entities/rate.entity';
import { Repository } from 'typeorm';



@Injectable()
export class RateSeeder {
  constructor(
    @InjectRepository(Rate) private rateRepository: Repository<Rate>,
  ) {}

  async run() {
    await this.rateRepository.save([
      {
        value:4,
        closedOrder:{id:1}
      },
      {
        value:2,
        closedOrder:{id:2}
      }
    ]);
  }
}
