import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { PaymentTypeEnum } from 'src/common/enums/paymentType';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { PaymentType } from 'src/modules/payments/entities/payment-type.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class PaymentTypeSeeder {
  constructor(
    @InjectRepository(PaymentType) private paymentTypeRepository: Repository<PaymentType>,
  ) {}

  async run() {
    await this.paymentTypeRepository.save([
      {
        name_en: 'cash',
        name_ar: 'نقدي',
      },
    ]);
  }
}
