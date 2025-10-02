import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorEnum } from 'src/common/enums/color';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { Truck } from 'src/modules/trucks/entities/truck.entity';
import { Repository } from 'typeorm';



@Injectable()
export class TruckSeeder {
  constructor(
    @InjectRepository(Truck) private truckRepository: Repository<Truck>,
  ) {}

  async run() {
    await this.truckRepository.save([
      {
        plateNumber: '1234',
        color: ColorEnum.WHITE,
        isAvailable: 0,
        isActive: 1,
        details: 'clean',
        truckModel:{id:1},
        driver:{id:1},
      },
      {
        plateNumber: '5432',
        color: ColorEnum.YELLOW,
        isAvailable: 0,
        isActive: 1,
        details: 'very old',
        truckModel :{id:2},
        driver:{id:1},
      },
      {
        plateNumber: '5554',
        color: ColorEnum.WHITE,
        isAvailable: 0,
        isActive: 1,
        details: 'new',
        truckModel :{id:1},
        driver:{id:2},
      },
    ]);
  }
}
