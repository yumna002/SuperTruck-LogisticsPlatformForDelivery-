import { Test, TestingModule } from '@nestjs/testing';
import { TruckModelsService } from './truck-models.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TruckModel } from './entities/truck-model.entity';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateTruckModelDto } from './dto/update-truck-model.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import * as fs from 'fs';
import { TrucksService } from '../trucks/trucks.service';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';



beforeAll(async () => {
  initializeTransactionalContext();

  const testDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',           
    port: 3306,                  
    username: 'root',       
    password: 'root',   
    database: 'supertruckdb',         
    entities: [],                
    synchronize: true,
  });

  await testDataSource.initialize(); 
  addTransactionalDataSource(testDataSource); 
});


describe('TruckModelsService', () => {
  let service: TruckModelsService;
  let mockTruckModelRepository: {
    createQueryBuilder: jest.Mock;
    delete: jest.Mock;
  };
  let mockTrucksService: {};

  beforeEach(async () => {
    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
    };

    jest.mock('fs');
    (fs.existsSync as jest.Mock) = jest.fn();
    (fs.unlinkSync as jest.Mock) = jest.fn();

    mockTruckModelRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      delete:jest.fn()
    };

    mockTrucksService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TruckModelsService,
        { provide: getRepositoryToken(TruckModel), useValue: mockTruckModelRepository },
        { provide: TrucksService, useValue: mockTrucksService },
      ],
    }).compile();

    service = module.get<TruckModelsService>(TruckModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  describe('findOne',()=>{
    it('should find one truckModel object',async ()=>{
      const findOneDto: FindOneDto = { year: '2010' };
      const mockResult = { id: 1, name: 'suzuki' };
        
      const qb = mockTruckModelRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
        
      const realResult = await service.findOne(findOneDto);

      expect(mockTruckModelRepository.createQueryBuilder).toHaveBeenCalledWith('truckModel');
      expect(qb.andWhere).toHaveBeenCalledWith('truckModel.year = :year', { year: findOneDto.year });
      expect(qb.getOne).toHaveBeenCalled();
        
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return null (not send anything)',async ()=>{
      const findOneDto: FindOneDto = {};
      const mockResult = null;
        
      const qb = mockTruckModelRepository.createQueryBuilder();
        
      const realResult = await service.findOne(findOneDto);
        
      expect(mockTruckModelRepository.createQueryBuilder).toHaveBeenCalledWith('truckModel');
  
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return null didnt find truckModel (wrong year)',async ()=>{
      const findOneDto: FindOneDto = { year: '2002' };
      const mockResult = null;
        
      const qb = mockTruckModelRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
        
      const realResult = await service.findOne(findOneDto);
        
      expect(mockTruckModelRepository.createQueryBuilder).toHaveBeenCalledWith('truckModel');
      expect(qb.andWhere).toHaveBeenCalledWith('truckModel.year = :year', { year: findOneDto.year });
      expect(qb.getOne).toHaveBeenCalled();
  
      expect(realResult).toEqual(mockResult);
    })
  });
  
  describe('findAll',()=>{
    it('should return array(all truckModels objects)',async ()=>{
      const findAllDto: FindAllDto = {};
      const mockResult =[
        {id:1,name:'suzuki',year:'2010',model:'mini van',sizeTypeId:1},
        {id:2,name:'toyota',year:'2010',model:'mini van',sizeTypeId:1},
    ];
        
      const qb = mockTruckModelRepository.createQueryBuilder();
      qb.getMany.mockResolvedValue(mockResult);
        
      const realResult = await service.findAll(findAllDto);
  
      expect(mockTruckModelRepository.createQueryBuilder).toHaveBeenCalledWith('truckModel');
      expect(qb.getMany).toHaveBeenCalled();
  
      expect(realResult).toEqual(mockResult);
    })
  
    it('should return truckModels (with year & sizeTypeId)',async ()=>{
      const findAllDto: FindAllDto = {year:'2010',sizeTypeId:1};
      const mockResult =[
        {id:1,name:'suzuki',year:'2010',model:'mini van',sizeTypeId:1},
      ];
        
      const qb = mockTruckModelRepository.createQueryBuilder();
      qb.getMany.mockResolvedValue(mockResult);
        
      const realResult = await service.findAll(findAllDto);
  
      expect(mockTruckModelRepository.createQueryBuilder).toHaveBeenCalledWith('truckModel');
      expect(qb.andWhere).toHaveBeenCalledWith('truckModel.year = :year', { year: findAllDto.year });
      expect(qb.andWhere).toHaveBeenCalledWith('truckModel.sizeTypeId = :sizeTypeId', { sizeTypeId: findAllDto.sizeTypeId });
      expect(qb.getMany).toHaveBeenCalled();

      expect(realResult).toEqual(mockResult);
    })
  });
  
  describe('update',()=>{
    it('should return NotFoundException',async ()=>{
      const updateDto: UpdateTruckModelDto = { id: 0 };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
  
      await expect(service.updateTruckModel(updateDto)).rejects.toThrow(
        new NotFoundException(I18nKeys.exceptionMessages.notFoundException),
      );
    })
  });

  describe('deleteTruckModel',()=>{
    it('should throw NotFoundException if truckModel not found', async () => {
      const findOneDto: FindOneDto = { id: 0 };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
  
      await expect(service.deleteTruckModel(findOneDto)).rejects.toThrow(
        new NotFoundException(I18nKeys.exceptionMessages.notFoundException),
      );
    })

    it('should throw usedError if truckModel is in use', async () => {
    })

    it('should return {} and delete truckModel (& delete photo if exists)', async () => {
      const findOneDto: FindOneDto = { id: 1 };
      const mockResult={};
      
      const mockTruckModel =new TruckModel;
      mockTruckModel.id = 1;
      mockTruckModel.photo='/path/to/photo.jpg';
 
      jest.spyOn(service, 'getOneTruckModelIfExist').mockResolvedValue(mockTruckModel);

      (mockTrucksService as any).findAll = jest.fn().mockResolvedValue([]);

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      const realResult = await service.deleteTruckModel(findOneDto);

      expect(service.getOneTruckModelIfExist).toHaveBeenCalledWith(findOneDto);
      expect((mockTrucksService as any).findAll).toHaveBeenCalledWith({ truckModelId: mockTruckModel.id });
      expect(fs.existsSync).toHaveBeenCalledWith(mockTruckModel.photo);
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockTruckModel.photo);
      expect(mockTruckModelRepository.delete).toHaveBeenCalledWith(mockTruckModel.id);

      expect(realResult).toEqual(mockResult);
    })
  });

});
