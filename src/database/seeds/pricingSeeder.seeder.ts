import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from 'src/modules/pricing/entities/pricing.entity';



@Injectable()
export class PricingSeeder {
  constructor(
    @InjectRepository(Pricing) private pricingRepository: Repository<Pricing>,
  ) {}

  async run() {
    await this.pricingRepository.save([
      {
        firstFloorPrice: 15000, //or 10
        highestValueSmallWeight: 50, //in kg
        highestValueMediumWeight: 75,
        increaseRateMediumWeight: 30, //or 20
        increaseRateHeavyWeight: 40, //or 30
        netProfit: 50 //or 60
      },
    ]);
  }
}
