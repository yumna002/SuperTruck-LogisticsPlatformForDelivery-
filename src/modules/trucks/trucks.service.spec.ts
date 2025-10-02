import { Test, TestingModule } from '@nestjs/testing';
import { TrucksService } from './trucks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { REQUEST } from '@nestjs/core';
import { FindOneDto } from './dto/findOne.dto';
import { ColorEnum } from 'src/common/enums/color';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';

describe('TrucksService', () => {
  let service: TrucksService;
  let mockTruckRepository: {
    createQueryBuilder: jest.Mock;
  };
  let mockRequest: any;

  beforeEach(async () => {
    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockTruckRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockRequest = { userId: 1 };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrucksService,
        { provide: getRepositoryToken(Truck), useValue: mockTruckRepository },
        { provide: REQUEST, useValue: mockRequest, },
      ],
    }).compile();

    service = module.get<TrucksService>(TrucksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne',()=>{
    it('should find one truck object',async ()=>{
      const findOneDto: FindOneDto = { driverId: 1 };
      const mockResult = { id: 1, blateNumber: '1234', color:ColorEnum.BLUE };
        
      const qb = mockTruckRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
        
      const realResult = await service.findOne(findOneDto);

      expect(mockTruckRepository.createQueryBuilder).toHaveBeenCalledWith('truck');
      expect(qb.andWhere).toHaveBeenCalledWith('truck.driverId = :driverId', { driverId: findOneDto.driverId });
      expect(qb.getOne).toHaveBeenCalled();
        
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return null (not send anything)',async ()=>{
      const findOneDto: FindOneDto = {};
      const mockResult = null;
        
      const qb = mockTruckRepository.createQueryBuilder();
        
      const realResult = await service.findOne(findOneDto);
        
      expect(mockTruckRepository.createQueryBuilder).toHaveBeenCalledWith('truck');
  
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return null didnt find truck (wrong id)',async ()=>{
      const findOneDto: FindOneDto = { id: 0 };
      const mockResult = null;
        
      const qb = mockTruckRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
        
      const realResult = await service.findOne(findOneDto);
        
      expect(mockTruckRepository.createQueryBuilder).toHaveBeenCalledWith('truck');
      expect(qb.andWhere).toHaveBeenCalledWith('truck.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();
  
      expect(realResult).toEqual(mockResult);
    })
  });
  
  describe('findAll',()=>{
    it('should return array(all trucks objects)',async ()=>{
      const findAllDto: FindAllDto = {};
      const mockResult =[
        {id:1,plateNumber:'1234',color:ColorEnum.BLUE,truckModelId:1},
        {id:2,plateNumber:'4567',color:ColorEnum.RED,truckModelId:2},
      ];
        
      const qb = mockTruckRepository.createQueryBuilder();
      qb.getMany.mockResolvedValue(mockResult);
        
      const realResult = await service.findAll(findAllDto);
  
      expect(mockTruckRepository.createQueryBuilder).toHaveBeenCalledWith('truck');
      expect(qb.innerJoin).toHaveBeenCalledWith('truck.driver', 'driver');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('truck.truckModel', 'truckModel');
      expect(qb.getMany).toHaveBeenCalled();
  
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return trucks (with truckModelId & isAvailable)',async ()=>{
      const findAllDto: FindAllDto = {truckModelId:1,isAvailable:1};
      const mockResult =[
        {id:1,plateNumber:'1234',color:ColorEnum.BLUE,truckModelId:1},
        {id:2,plateNumber:'4567',color:ColorEnum.RED,truckModelId:1},
      ];
        
      const qb = mockTruckRepository.createQueryBuilder();
      qb.getMany.mockResolvedValue(mockResult);
        
      const realResult = await service.findAll(findAllDto);

      expect(mockTruckRepository.createQueryBuilder).toHaveBeenCalledWith('truck');
      expect(qb.innerJoin).toHaveBeenCalledWith('truck.driver', 'driver');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('truck.truckModel', 'truckModel');

      expect(qb.andWhere).toHaveBeenCalledWith('truck.truckModelId = :truckModelId', { truckModelId: findAllDto.truckModelId });
      expect(qb.andWhere).toHaveBeenCalledWith('truck.isAvailable = :isAvailable', { isAvailable: findAllDto.isAvailable });
      expect(qb.getMany).toHaveBeenCalled();

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
