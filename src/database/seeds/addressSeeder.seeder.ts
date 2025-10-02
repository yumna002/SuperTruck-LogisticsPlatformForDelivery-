import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaEnum } from 'src/common/enums/area';
import { CityEnum } from 'src/common/enums/city';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Repository } from 'typeorm';



@Injectable()
export class AddressSeeder {
  constructor(
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
  ) {}

  async run() {
    await this.addressRepository.save([
      {
        city: CityEnum.DAMASCUS,
        area: AreaEnum.HARIQA,
        street: 'hariqa',
        floor: 1,
        isActive: 1,
        name: 'ساحة الحريقة',
        details: '',
        latitude: 33.5096955,
        longitude: 36.3017906,
        googlePlaceId: 'ChIJGxhzq1HmGBURA2C5SB0xcq8', 
        customer: { id: 1 },
      },
      {
        city: CityEnum.DAMASCUS,
        area: AreaEnum.MAZZEH,
        street: 'al mazzeh',
        floor: 4,
        isActive: 1,
        name: 'المزة',
        details: '',
        latitude: 33.4966300,
        longitude: 36.2466421,
        googlePlaceId: 'ChIJ6RABmx7eGBURMXWI33CgQWg', 
        customer: { id: 1 },
      },
      {
        city: CityEnum.RIF_DIMASHQ,
        area: AreaEnum.BARZEH,
        street: 'barzeh al balad',
        floor: 7,
        isActive: 1,
        name: 'برزة البلد جامع السلام',
        details: '',
        latitude: 33.5581773,
        longitude: 36.3240141,
        googlePlaceId: 'ChIJ9012homs789', 
        customer: { id: 2 },
      },
      {
        city: CityEnum.DAMASCUS,
        area: AreaEnum.ZABLATANI,
        street: 'al zablatany',
        floor: 3,
        isActive: 1,
        name: 'الزبلطاني الجوازات',
        details: '',
        latitude: 33.5015211,
        longitude: 36.2469079,
        googlePlaceId: 'ChIJ6RABmx7eGBURMXWI33CgQWg', 
        customer: { id: 3 },
      },
      {
        city: CityEnum.DAMASCUS,
        area: AreaEnum.BARZEH,
        street: 'barzeh al balad',
        floor: 3,
        isActive: 1,
        name: 'sama home',
        details: '',
        latitude: 33.5503374,
        longitude: 36.3068999,
        googlePlaceId: 'ChIJ6RABmx7eGBURMXWI33CgQWg', 
        customer: { id: 1 },
      },
    ]);
  }
}
