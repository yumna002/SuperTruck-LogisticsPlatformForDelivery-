import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindOneDto } from './dto/findOne.dto';
import { UpdateDto } from './dto/update.dto';
import { hashPassword } from 'src/shared/utils/hashingFunctions';
import { CreateUserDto } from './dto/createUser.dto';
import { Role } from './entities/role.entity';
import { FindOneRoleDto } from './dto/findOneRole.dto';
import { FindAllDto } from './dto/findAll.dto';
import { paginate } from 'src/shared/utils/paginateFunction';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @Inject(REQUEST) private request: Request,
  ) {}
  

  async findOne(findOneDto: FindOneDto):Promise<User|null> {
    const qb = this.userRepository.createQueryBuilder('user');
    let ok=1;

    qb.leftJoinAndSelect('user.role', 'role');

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('user.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.phoneNumber!=null) {
      ok=0;
      qb.andWhere('user.phoneNumber = :phoneNumber', { phoneNumber: findOneDto.phoneNumber });
    }

    if (findOneDto.isActive!=null) {
      ok=0;
      qb.andWhere('user.isActive = :isActive', { isActive: findOneDto.isActive });
    }

    if (findOneDto.refreshToken!=null) {
      ok=0;
      qb.andWhere('user.refreshToken = :refreshToken', { refreshToken: findOneDto.refreshToken });
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    qb.leftJoinAndSelect('user.role', 'role');
    
    if(findAllDto.isActive!=null) {
      qb.andWhere('user.isActive = :isActive', { isActive: findAllDto.isActive });    
    }

    return await paginate(qb, {page:findAllDto.page, limit:findAllDto.limit});
  }

  async update(updateDto:UpdateDto) {
    const user = await this.getOneUserIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        if(key === 'isActive'){
          user[key] = 1-user[key];
        }
        else{
          user[key] = updateDto[key];
        }
      }
    });

    await this.userRepository.save(user);
    return user;
  }

  async getCurrentUser():Promise<User> {
    const cur_user = await this.userRepository.findOneBy({
      id: this.request['userId'],
    });
    if (!cur_user) {
      throw new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException);
    }

    return cur_user;
  }

  async createUser(createUserDto:CreateUserDto) {
    const user=await this.isExistUser({phoneNumber:createUserDto.phoneNumber});
    if(user){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException)
    }

    let hashedPassword = '';
    if(createUserDto.password!=null){
      hashedPassword=await hashPassword(createUserDto.password);
    }

    //createUser
    const newUser=this.userRepository.save({
      phoneNumber: createUserDto.phoneNumber,
      password: hashedPassword,
      userType: createUserDto.userType,
      role: {id:createUserDto.roleId}
    })

    return newUser;
  }

  async findOneRole(findOneRoleDto:FindOneRoleDto):Promise<Role|null> {
    const qb = this.roleRepository.createQueryBuilder('role');
    let ok=1;

    if (findOneRoleDto.id!=null) {
      ok=0;
      qb.andWhere('role.id = :id', { id: findOneRoleDto.id });
    }

    if (findOneRoleDto.name!=null) {
      ok=0;
      qb.andWhere('role.name = :name', { name: findOneRoleDto.name });
    }

    if(ok)return null;
    
    return await qb.getOne();
  }

  async getOneUserIfExist(findOneDto: FindOneDto):Promise<User> {
    const user=await this.findOne(findOneDto);
    if(!user){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return user;
  }

  async getOneRoleIfExist(findOneRoleDto:FindOneRoleDto):Promise<Role> {
    const role=await this.findOneRole(findOneRoleDto);
    if(!role){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return role;
  }

  async isExistUser(findOneDto: FindOneDto):Promise<Boolean> {
    const user=await this.findOne(findOneDto);
    if(!user)return false;
    else return true;
  }

  async isExistRole(findOneDto: FindOneDto):Promise<Boolean> {
    const role=await this.findOneRole(findOneDto);
    if(!role)return false;
    else return true;
  }
}
