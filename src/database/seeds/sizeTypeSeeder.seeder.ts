import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SizeTypeEnum } from 'src/common/enums/sizeType';
import { SizeType } from 'src/modules/truck-models/entities/size-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class sizeTypeSeeder {
  constructor(
    @InjectRepository(SizeType) private sizeTypeRepository: Repository<SizeType>,
  ) {}

  async run() {
    await this.sizeTypeRepository.save([
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
