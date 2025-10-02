import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { paginate } from 'src/shared/utils/paginateFunction';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { UpdateDto } from './dto/update.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { UsersService } from '../users/users.service';
import { throwIfEmpty } from 'rxjs';
import { hashPassword } from 'src/shared/utils/hashingFunctions';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { CreateDto } from './dto/create.dto';
import { AddressesService } from '../addresses/addresses.service';
import { FindOneCustomerWithAddressesDto } from './dto/findOneCustomerWithAddresses.dto';
import { REQUEST } from '@nestjs/core';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { UserTypeEnum } from 'src/common/enums/userType';
import { AuthService } from '../auth/auth.service';
import { Transactional } from 'typeorm-transactional';



@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    private readonly addressesService: AddressesService,
    @Inject(REQUEST) private request: Request,
  ) {}


  async findAll(findAllDto:FindAllDto) {
    const qb = this.customerRepository.createQueryBuilder('customer');

    //qb.innerJoin('customer.user', 'user');
    qb.leftJoin('customer.user', 'user').addSelect(['user.phoneNumber', 'user.isActive']);
    
    if(findAllDto.isActive!=null) {
      qb.andWhere('user.isActive = :isActive', { isActive: findAllDto.isActive });    
    }

    if (findAllDto.name!=null) {
      qb.andWhere('customer.fullName LIKE :name', { name: `%${findAllDto.name}%` });    
    }

    return await paginate(qb, {page:findAllDto.page, limit:findAllDto.limit});
  }

  async findOne(findOneDto: FindOneDto):Promise<Customer|null> {
    const qb = this.customerRepository.createQueryBuilder('customer');
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('customer.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.birthdate!=null) {
      ok=0;
      qb.andWhere('customer.birthdate = :birthdate', { birthdate: findOneDto.birthdate });
    }

    if (findOneDto.fullName!=null) {
      ok=0;
      qb.andWhere('customer.fullName = :fullName', { fullName: findOneDto.fullName });
    }
    
    if(findOneDto.userId!=null){
      ok=0;
      qb.andWhere('customer.userId = :userId', { userId: findOneDto.userId });
    }
    if(ok)return null;
    
    return await qb.getOne();
  }

  async findOneCustomerWithAddresses(findOneCustomerWithAddressesDto: FindOneCustomerWithAddressesDto) {
    const customer=await this.getOneIfExist({userId:findOneCustomerWithAddressesDto.id});

    const addresses=await this.addressesService.findAll({customerId:customer.id});

    return {
      customer:customer,
      addresses:addresses
    };
  }

  async update(updateDto:UpdateDto) {
    const customer = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        customer[key] = updateDto[key];
      }
    });

    await this.customerRepository.save(customer);
    return customer;
  }

  @Transactional()
  async create(createDto:CreateDto) {
    const isExist=await this.isExist({fullName:createDto.fullName,birthdate:createDto.birthdate});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const role=await this.usersService.getOneRoleIfExist({name:RoleTypeEnum.CUSTOMER});
    
    //create user
    const newUser=await this.usersService.createUser({
      phoneNumber:createDto.phoneNumber,
      password:createDto.password,
      userType:UserTypeEnum.CUSTOMER,
      roleId:role.id
    })

    //createCustomer
    const newCustomer=this.customerRepository.save({
      fullName:createDto.fullName,
      birthdate:createDto.birthdate,
      user:{id:newUser.id},
    })

    //generate token to log the user in
    return await this.authService.getTokens(newUser.id,newUser.phoneNumber,role.name);
  }

  async getCurrentCustomer():Promise<Customer> {
    const customer=await this.findOne({userId:this.request['userId']});
    if(!customer){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return customer;
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<Customer> {
    const customer=await this.findOne(findOneDto);
    if(!customer){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return customer;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const customer=await this.findOne(findOneDto);
    if(!customer)return false;
    else return true;
  }

}
