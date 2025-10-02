import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class FuelTypeSeeder {
  constructor(
    @InjectRepository(FuelType) private feulTypeRepository: Repository<FuelType>,
  ) {}

  async run() {
    await this.feulTypeRepository.save([
      {
        name_en: 'gasoline',
        name_ar: 'بنزين',
        price: 12100,
      },
      {
        name_en: 'diesel',
        name_ar: 'مازوت',
        price: 9500,
      },
    ]);
  }
}
