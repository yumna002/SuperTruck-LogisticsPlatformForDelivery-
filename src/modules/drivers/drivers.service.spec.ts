import { Test, TestingModule } from '@nestjs/testing';
import { DriversService } from './drivers.service';
import * as paginateFunction from '../../shared/utils/paginateFunction';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { UsersService } from '../users/users.service';
import { TruckModelsService } from '../truck-models/truck-models.service';
import { REQUEST } from '@nestjs/core';
import { TrucksService } from '../trucks/trucks.service';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';


describe('DriversService', () => {
  let service: DriversService;
  let mockDriverRepository: {
    createQueryBuilder: jest.Mock;
  };
  let mockUsersService: {};
  let mockTrucksService: {};
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
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockDriverRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockRequest = { userId: 1 };
    mockUsersService = {};
    mockTrucksService = {};

    jest.spyOn(paginateFunction, 'paginate').mockResolvedValue({
      elements: [],
      total: 1,
      page: 1,
      lastPage: 1,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: getRepositoryToken(Driver), useValue: mockDriverRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: TrucksService, useValue: mockTrucksService },
        { provide: REQUEST, useValue: mockRequest, },
      ],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne',()=>{
    it('should find one driver object (send id)',async ()=>{
      const findOneDto: FindOneDto = { id: 1 };
      const mockResult = { id: 1, firstName: 'sama' };
      
      const qb = mockDriverRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockDriverRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
      expect(qb.andWhere).toHaveBeenCalledWith('driver.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();
      
      expect(realResult).toEqual(mockResult);
    })

    it('should return null (not send anything)',async ()=>{
      const findOneDto: FindOneDto = {};
      const mockResult = null;
      
      const qb = mockDriverRepository.createQueryBuilder();
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockDriverRepository.createQueryBuilder).toHaveBeenCalledWith('driver');

      expect(realResult).toEqual(mockResult);
    })

    it('should return null didnt find driver (wrong id)',async ()=>{
      const findOneDto: FindOneDto = { id: 0 };
      const mockResult = null;
      
      const qb = mockDriverRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockDriverRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
      expect(qb.andWhere).toHaveBeenCalledWith('driver.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();

      expect(realResult).toEqual(mockResult);
    })
  });

  describe('findAll',()=>{
    it('should return array(all drivers objects)',async ()=>{
      const findAllDto: FindAllDto = {};
      const mockResult ={
        elements: [{id:1,firstName:'sama',lastName:'tounsi',city:'damas'}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockDriverRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockDriverRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
      expect(qb.leftJoin).toHaveBeenCalledWith('driver.user', 'user');
      expect(qb.addSelect).toHaveBeenCalledWith(['user.phoneNumber', 'user.isActive']);
      expect(paginateFunction.paginate).toHaveBeenCalled();


      expect(realResult).toEqual(mockResult);
    })

    it('should return drivers (with isActive & firstName)',async ()=>{
      const findAllDto: FindAllDto = {isActive:1,name:'sama'};
      const mockResult ={
        elements: [{id:1,firstName:'sama',lastName:'tounsi',city:'damas'}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockDriverRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockDriverRepository.createQueryBuilder).toHaveBeenCalledWith('driver');
      expect(qb.leftJoin).toHaveBeenCalledWith('driver.user', 'user');
      expect(qb.addSelect).toHaveBeenCalledWith(['user.phoneNumber', 'user.isActive']);
      expect(qb.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: findAllDto.isActive });
      expect(qb.andWhere).toHaveBeenCalledWith('(driver.firstName LIKE :name OR driver.lastName LIKE :name)',{ name: `%${findAllDto.name}%` },);
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
