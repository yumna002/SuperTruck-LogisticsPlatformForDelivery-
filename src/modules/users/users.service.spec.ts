import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { FindOneDto } from './dto/findOne.dto';
import { User } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { REQUEST } from '@nestjs/core';
import { Role } from './entities/role.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRequest: any;
  let mockUserRepository: {
    createQueryBuilder: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
  };
  let mockRoleRepository: {
  };

  beforeEach(async () => {
    mockRequest = { userId: 1 };

    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    mockUserRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    mockRoleRepository = {
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
        { provide: REQUEST, useValue: mockRequest, },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne',()=>{
    it('should return user by id', async () => {
      const findOneDto: FindOneDto = { id: 1 };
      const mockResult = { id: 1, phoneNUmber:'+963900000000' };

      const qb = mockUserRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
  
      const realResult = await service.findOne(findOneDto);
  
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.andWhere).toHaveBeenCalledWith('user.id = :id', { id: findOneDto.id });
      
      expect(realResult).toEqual(mockResult);
    })

    it('should return user (by given isActive & phoneNumber)', async () => {
      const findOneDto: FindOneDto = { isActive:1, phoneNumber:'+963900000000' };
      const mockResult = { id: 1, phoneNUmber:'+963900000000' };

      const qb = mockUserRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
  
      const realResult = await service.findOne(findOneDto);
  
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: findOneDto.isActive });
      expect(qb.andWhere).toHaveBeenCalledWith('user.phoneNumber = :phoneNumber', { phoneNumber: findOneDto.phoneNumber });
      
      expect(realResult).toEqual(mockResult);
    })

    it('should return null (without anything)', async () => {
      const findOneDto: FindOneDto = {};
      const mockResult = null;

      const qb = mockUserRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
  
      const realResult = await service.findOne(findOneDto);
  
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('user.role', 'role');

      expect(realResult).toEqual(mockResult);
    })
  });

  describe('update',()=>{
    it('should return NotFoundException',async ()=>{
      const updateDto: UpdateDto = { id: 0 };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(updateDto)).rejects.toThrow(
        new NotFoundException(I18nKeys.exceptionMessages.notFoundException),
      );
    })

    it('should update refreshToken', async () => {
      const updateDto: UpdateDto = { id: 1, refreshToken: 'newToken' };
      const mockUser=new User;
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);
  
      await service.update(updateDto);
  
      expect(mockUser.refreshToken).toBe('newToken');
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    })
  });

  describe('getCurrentUser',()=>{
    it('should return current user', async () => {
      const mockUser = new User;

      mockUserRepository.findOneBy.mockResolvedValue(new User);
  
      const realResult = await service.getCurrentUser();
  
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: mockRequest.userId });
      
      expect(realResult).toEqual(mockUser);
    })
  
    it('should return NotFoundException', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
  
      await expect(service.getCurrentUser()).rejects.toThrow(
        new UnauthorizedException(I18nKeys.exceptionMessages.unauthorizedException),
      );
    })
  });
  
});
