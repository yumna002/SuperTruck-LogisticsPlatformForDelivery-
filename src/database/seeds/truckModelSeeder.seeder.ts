import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TruckModelBrandEnum } from 'src/common/enums/truckModelBrand';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { VehicleType } from 'src/modules/truck-models/entities/vehicle-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class TruckModelSeeder {
  constructor(
    @InjectRepository(TruckModel) private truckModelRepository: Repository<TruckModel>,
  ) {}

  async run() {
    await this.truckModelRepository.save([
      {
        brand: TruckModelBrandEnum.SUZUKI,
        model: 'Daewoo',
        width: 1.47,
        height: 1.80,
        length: 3.39,
        year: '1983',
        photo: 'src\\public\\images\\truckModelsImages\\Suzuki carry 2010.jpeg',
        details: 'a Japanese truck, commercial model.',
        fuelConsumption: 0.06, 
        maximumWeightCapacity: 350,
        fuelType:{id:1},
        sizeType:{id:2},
        vehicleType:{id:1},
      },
      {
        brand: TruckModelBrandEnum.KIA,
        model: 'Bongo K4000G',
        width: 1.75,
        height: 2.09,
        length: 5.45,
        year: '1980',
        photo: 'src\\public\\images\\truckModelsImages\\Suzuki carry 2010.jpeg',
        details: 'a commercial light-duty truck designed for urban transport, and a durable cargo bed.',
        fuelConsumption: 0.10, 
        maximumWeightCapacity: 2545,
        fuelType:{id:2},
        sizeType:{id:3},
        vehicleType:{id:1},
      },
      {
        brand: TruckModelBrandEnum.KIA,
        model: 'tasman',
        width: 1.93,                 
        height: 1.87,                
        length: 5.41,                
        year: '2015',
        photo: 'src\\public\\images\\truckModelsImages\\Toyota Hilux 2010.jpg', 
        details: 'one-tonne pickup truck.',
        fuelConsumption: 0.12, //liter in one km       
        maximumWeightCapacity: 1145, //kg 
        fuelType:{id:1},
        sizeType:{id:2},
        vehicleType:{id:1},
      },
      {
        brand: TruckModelBrandEnum.KIA,
        model: 'k2700',
        width: 1.58, //meter
        height: 1.54, //meter
        length: 3.00, //meter
        year: '2002',
        photo: 'src\\public\\images\\truckModelsImages\\Kia 27000.png',
        details: 'a commercial light-duty pickup truck.',
        fuelConsumption: 0.16, 
        maximumWeightCapacity: 1300,
        fuelType:{id:2},
        sizeType:{id:1},
        vehicleType:{id:1},
      },
    ]);
  }
}
