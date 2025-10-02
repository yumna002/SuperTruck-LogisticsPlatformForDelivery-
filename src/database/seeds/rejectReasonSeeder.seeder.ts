import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/modules/rates/entities/rate.entity';
import { RejectReason } from 'src/modules/rejected-orders/entities/reject-reason.entity';
import { Repository } from 'typeorm';



@Injectable()
export class RejectReasonSeeder {
  constructor(
    @InjectRepository(RejectReason) private rejectReasonRepository: Repository<RejectReason>,
  ) {}

  async run() {
    await this.rejectReasonRepository.save([
      {
        name_en: 'vehicle capacity exceeded',
        name_ar: 'تجاوز سعة المركبة',
      },
      {
        name_en: 'route not accessible',
        name_ar: 'الطريق غير قابل للوصول',
      },
      {
        name_en: 'delivery location unclear',
        name_ar: 'موقع التسليم غير واضح',
      },
      {
        name_en: 'time conflict with other orders',
        name_ar: 'تعارض في الوقت مع طلبات أخرى',
      },
      {
        name_en: 'weather conditions',
        name_ar: 'ظروف الطقس',
      },
      {
        name_en: 'personal emergency',
        name_ar: 'حالة طارئة شخصية',
      },

    ]);
  }
}
