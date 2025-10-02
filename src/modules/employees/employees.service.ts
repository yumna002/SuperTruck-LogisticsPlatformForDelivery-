import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import { UpdateDto } from './dto/update.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { UsersService } from '../users/users.service';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { UserTypeEnum } from 'src/common/enums/userType';
import { paginate } from 'src/shared/utils/paginateFunction';
import { Transactional } from 'typeorm-transactional';



@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @Inject(REQUEST) private request: Request,
    private readonly usersService: UsersService,
  ) {}


  @Transactional()
  async create(createDto: CreateDto) {
    const isExist=await this.isExist({phoneNumber:createDto.phoneNumber});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const role=await this.usersService.getOneRoleIfExist({id:createDto.roleId});

    const newUser=await this.usersService.createUser({
      phoneNumber:createDto.phoneNumber,
      userType:UserTypeEnum.EMPLOYEE,
      password:null,
      roleId:role.id
    });

    const newEmployee=await this.employeeRepository.save({
      firstName:createDto.firstName,
      lastName:createDto.lastName,
      fatherName:createDto.fatherName,
      gender:createDto.gender,
      address:createDto.address,
      birthdate:createDto.birthdate,
      email:createDto.email,
      user:{id:newUser.id}
    });

    return newEmployee;
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.employeeRepository.createQueryBuilder('employee');
    
    qb.leftJoinAndSelect('employee.role','role');
    qb.innerJoin('employee.user', 'user');
    
    if(findAllDto.isActive!=null) {
      qb.andWhere('user.isActive = :isActive', { isActive: findAllDto.isActive });    
    }

    if (findAllDto.name!=null) {
      qb.andWhere('(employee.firstName LIKE :name OR employee.lastName LIKE :name)',{ name: `%${findAllDto.name}%` });      
    }

    return await paginate(qb, {page:findAllDto.page, limit:findAllDto.limit});
  }

  async findOne(findOneDto: FindOneDto):Promise<Employee|null> {
    const qb = this.employeeRepository.createQueryBuilder('employee');
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('employee.id = :id', { id: findOneDto.id });
    }
    if(findOneDto.userId!=null){
      ok=0;
      qb.andWhere('employee.userId = :userId', { userId: findOneDto.userId });
    }
    if(findOneDto.phoneNumber!=null){
      ok=0;
      qb.andWhere('employee.phoneNumber = :phoneNumber', { phoneNumber: findOneDto.phoneNumber });
    }

    if(ok)return null;
    
    return await qb.getOne();
  }

  async update(updateDto:UpdateDto) {
    const employee = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        employee[key] = updateDto[key];
      }
    });

    await this.employeeRepository.save(employee);
    return employee;
  }
  
  async getCurrentEmployee():Promise<Employee> {
    const employee=await this.findOne({userId:this.request['userId']});
    if(!employee){
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return employee;
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<Employee> {
    const employee=await this.findOne(findOneDto);
    if(!employee){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return employee;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const employee=await this.findOne(findOneDto);
    if(!employee)return false;
    else return true;
  }
}
