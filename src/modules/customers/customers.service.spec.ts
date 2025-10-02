import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { FindAllDto } from './dto/findAll.dto';
import { FindOneDto } from './dto/findOne.dto';
import * as paginateFunction from '../../shared/utils/paginateFunction';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { TokenService } from 'src/shared/utils/tokenFunctions';
import { AddressesService } from '../addresses/addresses.service';
import { REQUEST } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';



describe('CustomersService', () => {
  let service: CustomersService;
  let mockCustomerRepository: {
    createQueryBuilder: jest.Mock;
  };
  let mockUsersService: {};
  let mockAddressesService: {};
  let mockTokenService: {};
  let mockAuthService: {};
  let mockRequest: any;
  
  
  beforeEach(async () => {
    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{id:1,fullName:'sama',email:'e',city:'c',userId:2}]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockCustomerRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockRequest = { userId: 1 };
    mockUsersService = {};
    mockTokenService= {};
    mockAuthService= {};
    mockAddressesService= {};

    jest.spyOn(paginateFunction, 'paginate').mockResolvedValue({
      elements: [{id:1,fullName:'sama',email:'e',city:'c',userId:2}],
      total: 1,
      page: 1,
      lastPage: 1,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: mockCustomerRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AddressesService, useValue: mockAddressesService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: REQUEST, useValue: mockRequest, },

      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne',()=>{
    it('should find one customer object',async ()=>{
      const findOneDto: FindOneDto = { id: 1 };
      const mockResult = { id: 1, name: 'sama' };
      
      const qb = mockCustomerRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockCustomerRepository.createQueryBuilder).toHaveBeenCalledWith('customer');
      expect(qb.andWhere).toHaveBeenCalledWith('customer.id = :id', { id: 1 });
      expect(qb.getOne).toHaveBeenCalled();
      
      expect(realResult).toEqual(mockResult);
    })

    it('should return null (not send anything)',async ()=>{
      const findOneDto: FindOneDto = {};
      const mockResult = null;
      
      const qb = mockCustomerRepository.createQueryBuilder();
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockCustomerRepository.createQueryBuilder).toHaveBeenCalledWith('customer');

      expect(realResult).toEqual(mockResult);
    })

    it('should return null didnt find customer (wrong id)',async ()=>{
      const findOneDto: FindOneDto = { id: 0 };
      const mockResult = null;
      
      const qb = mockCustomerRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockCustomerRepository.createQueryBuilder).toHaveBeenCalledWith('customer');
      expect(qb.andWhere).toHaveBeenCalledWith('customer.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();

      expect(realResult).toEqual(mockResult);
    })
  });

  describe('findAll',()=>{
    it('should return array(all customers objects)',async ()=>{
      const findAllDto: FindAllDto = {};
      const mockResult ={
        elements: [{id:1,fullName:'sama',email:'e',city:'c',userId:2}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockCustomerRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockCustomerRepository.createQueryBuilder).toHaveBeenCalledWith('customer');
      expect(qb.leftJoin).toHaveBeenCalledWith('customer.user', 'user');
      expect(qb.addSelect).toHaveBeenCalledWith(['user.phoneNumber', 'user.isActive']);

      expect(paginateFunction.paginate).toHaveBeenCalled();


      expect(realResult).toEqual(mockResult);
    })

    it('should return customers (with isActive & name)',async ()=>{
      const findAllDto: FindAllDto = {isActive:1,name:'sama'};
      const mockResult ={
        elements: [{id:1,fullName:'sama',email:'e',city:'c',userId:2}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockCustomerRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockCustomerRepository.createQueryBuilder).toHaveBeenCalledWith('customer');
      expect(qb.leftJoin).toHaveBeenCalledWith('customer.user', 'user');
      expect(qb.addSelect).toHaveBeenCalledWith(['user.phoneNumber', 'user.isActive']);
      expect(qb.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: findAllDto.isActive });
      expect(qb.andWhere).toHaveBeenCalledWith('customer.fullName LIKE :name', { name: `%${findAllDto.name}%` });
      expect(paginateFunction.paginate).toHaveBeenCalled();

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
  });

});
