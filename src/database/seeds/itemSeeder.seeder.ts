import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class ItemSeeder {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async run() {
    await this.itemRepository.save([
      {
        number:1,
        fragility:1,
        abilityToDisassemble:0,
        itemSize:{id:2},
        itemWeight:{id:2},
        order:{id:1},
        categoryType:{id:8},
      },
      {
        number:3,
        fragility:0,
        abilityToDisassemble:1,
        itemSize:{id:1},
        itemWeight:{id:1},
        order:{id:1},
        categoryType:{id:11},
      },
      {
        number:2,
        fragility:0,
        abilityToDisassemble:0,
        itemSize:{id:3},
        itemWeight:{id:2},
        order:{id:2},
        categoryType:{id:16},
      },
      {
        number:1,
        fragility:1,
        abilityToDisassemble:0,
        itemSize:{id:2},
        itemWeight:{id:1},
        order:{id:3},
        categoryType:{id:1},
      },
      {
        number:1,
        fragility:0,
        abilityToDisassemble:0,
        itemSize:{id:1},
        itemWeight:{id:1},
        order:{id:4},
        categoryType:{id:13},
      },
      {
        number:1,
        fragility:0,
        abilityToDisassemble:1,
        itemSize:{id:3},
        itemWeight:{id:3},
        order:{id:6},
        categoryType:{id:1},
      },
      {
        number:3,
        fragility:0,
        abilityToDisassemble:0,
        itemSize:{id:1},
        itemWeight:{id:1},
        order:{id:5},
        categoryType:{id:22},
      },
      {
        number:1,
        fragility:1,
        abilityToDisassemble:0,
        itemSize:{id:3},
        itemWeight:{id:3},
        order:{id:10},
        categoryType:{id:7},
      },
    ]);
  }
}
