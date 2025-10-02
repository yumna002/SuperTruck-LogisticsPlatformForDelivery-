import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOneDto } from './dto/findOne.dto';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { FindAllDto } from './dto/findAll.dto';
import { CustomersService } from '../customers/customers.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { CreateDto } from './dto/create.dto';
import { Customer } from '../customers/entities/customer.entity';
import { UpdateDto } from './dto/update.dto';



@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private readonly addressRepsitory: Repository<Address>,
    private readonly usersService: UsersService,
  ) {}

    
  async create(createDto: CreateDto) {
    const isExist=await this.isExist({name:createDto.name,customerId:createDto.customerId,isActive:1});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const address=await this.addressRepsitory.save({
      ...createDto,
      customer:{id:createDto.customerId},
    })

    return address;
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.addressRepsitory.createQueryBuilder('address');
    
    if(findAllDto.isActive!=null) {
      qb.andWhere('address.isActive = :isActive', { isActive: findAllDto.isActive });    
    }

    if (findAllDto.customerId!=null) {
      qb.andWhere('address.customerId = :customerId', { customerId: findAllDto.customerId });    
    }

    return await qb.getMany();
  }

  async findOne(findOneDto: FindOneDto):Promise<Address|null> {
    const qb = this.addressRepsitory.createQueryBuilder('address');
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('address.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.name!=null) {
      ok=0;
      qb.andWhere('address.name = :name', { name: findOneDto.name });
    }

    if (findOneDto.customerId!=null) {
      ok=0;
      qb.andWhere('address.customerId = :customerId', { customerId: findOneDto.customerId });
    }

    if (findOneDto.isActive!=null) {
      ok=0;
      qb.andWhere('address.isActive = :isActive', { isActive: findOneDto.isActive });
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async delete(findOneDto:FindOneDto) {
    const address=await this.getOneIfExist({id:findOneDto.id,isActive:1});
    
    await this.update({id:address.id,isActive:0});

    return{};
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<Address> {
    const address=await this.findOne(findOneDto);
    if(!address){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return address;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const address=await this.findOne(findOneDto);
    if(!address)return false;
    else return true;
  }

  async update(updateDto:UpdateDto) {
    const address = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        address[key] = updateDto[key];
      }
    });

    await this.addressRepsitory.save(address);
    return address;
  }
}
