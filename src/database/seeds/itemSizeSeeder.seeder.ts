import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { ItemSizeEnum } from 'src/common/enums/itemSize';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { ItemSize } from 'src/modules/items/entities/item-size.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ItemSizeSeeder {
  constructor(
    @InjectRepository(ItemSize) private itemSizeRepository: Repository<ItemSize>,
  ) {}

  async run() {
    await this.itemSizeRepository.save([
      {
        name_en: 'small',
        name_ar: 'صغير',
      },
      {
        name_en: 'medium',
        name_ar: 'متوسط',
      },
      {
        name_en: 'large',
        name_ar: 'كبير',
      },
    ]);
  }
}
