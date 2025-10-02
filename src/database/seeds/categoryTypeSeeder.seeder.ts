import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryTypeEnum } from 'src/common/enums/categoryType';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { Category } from 'src/modules/categories/entities/category.entity';
import { CategoryType } from 'src/modules/categories/entities/category-type.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class CategoryTypeSeeder {
  constructor(
    @InjectRepository(CategoryType) private categoryTypeRepository: Repository<CategoryType>,
  ) {}

  async run() {
    await this.categoryTypeRepository.save([
      // Electronics (id: 1)
      { name_en: 'TV', name_ar: 'تلفاز', category: { id: 1 } },
      { name_en: 'Computer', name_ar: 'كمبيوتر', category: { id: 1 } },
      { name_en: 'Laptop', name_ar: 'لابتوب', category: { id: 1 } },
      { name_en: 'Mobile Phone', name_ar: 'هاتف محمول', category: { id: 1 } },
      { name_en: 'Printer', name_ar: 'طابعة', category: { id: 1 } },
      { name_en: 'Microwave', name_ar: 'ميكرويف', category: { id: 1 } },
      { name_en: 'Fridge', name_ar: 'براد', category: { id: 1 } },
      { name_en: 'Washing Machine', name_ar: 'غسالة', category: { id: 1 } },
      { name_en: 'Oven', name_ar: 'فرن', category: { id: 1 } },

      // Furniture (id: 2)
      { name_en: 'Sofa', name_ar: 'صوفاية', category: { id: 2 } },
      { name_en: 'Chair', name_ar: 'كرسي', category: { id: 2 } },
      { name_en: 'Bed', name_ar: 'تخت', category: { id: 2 } },
      { name_en: 'Table', name_ar: 'طاولة', category: { id: 2 } },
      { name_en: 'Desk', name_ar: 'مكتب', category: { id: 2 } },
      { name_en: 'Shelf', name_ar: 'رف', category: { id: 2 } },
      { name_en: 'Cabinet', name_ar: 'خزانة', category: { id: 2 } },

      // Heating Tools (id: 3)
      { name_en: 'Electric Heater', name_ar: 'دفاية كهربائية', category: { id: 3 } },
      { name_en: 'Gas Heater', name_ar: 'دفاية غاز', category: { id: 3 } },

      // Food (id: 4)
      { name_en: 'Rice', name_ar: 'رز', category: { id: 4 } },
      { name_en: 'Sugar', name_ar: 'سكر', category: { id: 4 } },
      { name_en: 'Oil', name_ar: 'زيت', category: { id: 4 } },
      { name_en: 'Canned Food', name_ar: 'معلبات', category: { id: 4 } },

      // Construction Materials (id: 5)
      { name_en: 'Cement', name_ar: 'اسمنت', category: { id: 5 } },
      { name_en: 'Bricks', name_ar: 'بلوك', category: { id: 5 } },
      { name_en: 'Iron', name_ar: 'حديد', category: { id: 5 } },

      // Storage Box (id: 6)
      { name_en: 'Plastic Box', name_ar: 'صندوق بلاستيك', category: { id: 6 } },
      { name_en: 'Wooden Box', name_ar: 'صندوق خشب', category: { id: 6 } },

      // Sports Equipment (id: 7)
      { name_en: 'Treadmill', name_ar: 'جهاز مشي', category: { id: 7 } },
      { name_en: 'Weights', name_ar: 'أوزان', category: { id: 7 } },

      // Travel Bags (id: 8)
      { name_en: 'Suitcase', name_ar: 'شنطة سفر', category: { id: 8 } },
      { name_en: 'Backpack', name_ar: 'حقيبة ظهر', category: { id: 8 } },

      // Musical Instruments (id: 9)
      { name_en: 'Guitar', name_ar: 'غيتار', category: { id: 9 } },
      { name_en: 'Oud', name_ar: 'عود', category: { id: 9 } },

      // Tanks (id: 10)
      { name_en: 'Water Tank', name_ar: 'خزان ماء', category: { id: 10 } },
      { name_en: 'Fuel Tank', name_ar: 'خزان مازوت', category: { id: 10 } },

      // Energy Tools (id: 11)
      { name_en: 'Solar Panel', name_ar: 'لوح شمسي', category: { id: 11 } },
      { name_en: 'Battery', name_ar: 'بطارية', category: { id: 11 } },
      
    ]);
  }
}
