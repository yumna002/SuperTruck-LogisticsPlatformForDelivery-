import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEnum } from 'src/common/enums/category';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { Category } from 'src/modules/categories/entities/category.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class CategorySeeder {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
  ) {}

  async run() {
    await this.categoryRepository.save([
      { name_en: 'Electronics', name_ar: 'كهربائيات' },
      { name_en: 'Furniture', name_ar: 'أثاث' },
      { name_en: 'Heating Tools', name_ar: 'أدوات تدفئة' },
      { name_en: 'Food', name_ar: 'مواد غذائية' },
      { name_en: 'Construction Materials', name_ar: 'مواد بناء' },
      { name_en: 'Storage Box', name_ar: 'صندوق أغراض' },
      { name_en: 'Sports Equipment', name_ar: 'أدوات رياضة' },
      { name_en: 'Travel Bags', name_ar: 'حقائب سفر' },
      { name_en: 'Musical Instruments', name_ar: 'أدوات موسيقا' },
      { name_en: 'Tanks', name_ar: 'خزانات' },
      { name_en: 'Energy Tools', name_ar: 'أدوات الطاقة' },
      { name_en: 'Other', name_ar: 'غير ذلك' },
    ]);
  }
}
