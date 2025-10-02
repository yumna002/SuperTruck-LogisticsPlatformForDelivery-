import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEnum } from 'src/common/enums/city';
import { GenderEnum } from 'src/common/enums/gender';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class DriverSeeder {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
  ) {}

  async run() {
    await this.driverRepository.save([
      {
        firstName:'fatima',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.FEMALE,
        nationalNumber:'1',
        city:CityEnum.DAMASCUS,
        rate:0,
        rateSum:0,
        rateCount:0,
        extraProfit:0,
        isOnline:0,
        isAvailable:0,
        birthdate:'1998-07-15 00:00:00',
        user:{id:8},
      },
      {
        firstName:'lina',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.FEMALE,
        nationalNumber:'2',
        city:CityEnum.DAMASCUS,
        rate:0,
        rateSum:0,
        rateCount:0,
        extraProfit:0,
        isOnline:0,
        isAvailable:0,
        birthdate:'1998-07-15 00:00:00',
        user:{id:9},
      },
      {
        firstName:'omar',
        lastName:'a',
        fatherName:'a',
        address:'a',
        gender:GenderEnum.MALE,
        nationalNumber:'3',
        city:CityEnum.DAMASCUS,
        rate:0,
        rateSum:0,
        rateCount:0,
        extraProfit:0,
        isOnline:0,
        isAvailable:0,
        birthdate:'1998-07-15 00:00:00',
        user:{id:10},
      },
    ]);
  }
}
