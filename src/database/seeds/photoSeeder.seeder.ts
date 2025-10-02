import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelTypeEnum } from 'src/common/enums/fuelType';
import { PaymentTypeEnum } from 'src/common/enums/paymentType';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Photo } from 'src/modules/orders/entities/photo.entity';
import { PaymentType } from 'src/modules/payments/entities/payment-type.entity';
import { FuelType } from 'src/modules/truck-models/entities/fuel-type.entity';
import { Repository } from 'typeorm';



@Injectable()
export class PhotoSeeder {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}

  async run() {
    await this.photoRepository.save([
      {
        path: 'src\\public\\images\\orderImages\\chair.jpg',
        order: {id:1}
      },
      {
        path: 'src\\public\\images\\orderImages\\chair2.jpg',
        order: {id:1}
      },
      {
        path: 'src\\public\\images\\orderImages\\washingMachine.jpg',
        order: {id:1}
      },
      {
        path: 'src\\public\\images\\orderImages\\wardrobe.jpg',
        order: {id:2}
      },
      {
        path: 'src\\public\\images\\orderImages\\tv.jpg',
        order: {id:3}
      },
      {
        path: 'src\\public\\images\\orderImages\\table.jpg',
        order: {id:4}
      },
      {
        path: 'src\\public\\images\\orderImages\\tv.jpg',
        order: {id:6}
      },
      {
        path: 'src\\public\\images\\orderImages\\box1.jpg',
        order: {id:5}
      },
      {
        path: 'src\\public\\images\\orderImages\\box2.jpg',
        order: {id:5}
      },
      {
        path: 'src\\public\\images\\orderImages\\fridge.jpg',
        order: {id:10}
      },
    ]);
  }
}
