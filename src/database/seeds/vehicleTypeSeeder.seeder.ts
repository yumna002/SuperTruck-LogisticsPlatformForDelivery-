import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleTypeEnum } from 'src/common/enums/vehicleType';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class VehicleTypeSeeder {
  constructor(
    @InjectRepository(VehicleType) private vehicleTypeRepository: Repository<VehicleType>,
  ) {}

  async run() {
    await this.vehicleTypeRepository.save([
      {
        name_en: 'open',
        name_ar: 'مفتوح',
      },
      {
        name_en: 'closed',
        name_ar: 'مغلق',
      },
      {
        name_en: 'refrigerated',
        name_ar: 'مع تبريد',
      },
      {
        name_en: 'open_edges',
        name_ar: 'مفتوحة الزوايا',
      },
    ]);
  }
}
