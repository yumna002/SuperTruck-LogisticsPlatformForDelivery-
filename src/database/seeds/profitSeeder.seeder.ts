import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profit } from "src/modules/payments/entities/profit.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProfitSeeder {
  constructor(
    @InjectRepository(Profit) private profit: Repository<Profit>,
  ) {}

  async run() {
    await this.profit.save([
      {
        CompanyProfitPercentage:20
      },
    ]);
  }
}
