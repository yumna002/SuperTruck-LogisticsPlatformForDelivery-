import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { ItemWeightEnum } from 'src/common/enums/itemWeight';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemSize } from 'src/modules/items/entities/item-size.entity';
import { ItemWeight } from 'src/modules/items/entities/item-weight.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ItemWeightSeeder {
  constructor(
    @InjectRepository(ItemWeight) private itemWeightRepository: Repository<ItemWeight>,
  ) {}

  async run() {
    await this.itemWeightRepository.save([
      {
        name_en: 'light',
        name_ar: 'خفيف',
      },
      {
        name_en: 'med',
        name_ar: 'متوسط',
      },
      {
        name_en: 'heavy',
        name_ar: 'ثقيل',
      },
    ]);
  }
}
