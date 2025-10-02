import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UsersService } from '../users/users.service';
import { REQUEST } from '@nestjs/core';
import * as paginateFunction from '../../shared/utils/paginateFunction';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateDto } from './dto/update.dto';
import { NotFoundException } from '@nestjs/common';
import { I18nKeys } from 'src/common/i18n/i18n-keys';


describe('EmployeesService', () => {
  let service: EmployeesService;
  let mockEmployeeRepository: {
    createQueryBuilder: jest.Mock;
  };
  let mockUsersService: {};
  let mockRequest: any;

  beforeEach(async () => {
    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockEmployeeRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockRequest = { userId: 1 };
    mockUsersService = {};

    jest.spyOn(paginateFunction, 'paginate').mockResolvedValue({
      elements: [],
      total: 1,
      page: 1,
      lastPage: 1,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepository },
        { provide: UsersService, useValue: mockUsersService },
        { provide: REQUEST, useValue: mockRequest, },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne',()=>{
    it('should find one employee object (send id)',async ()=>{
      const findOneDto: FindOneDto = { id: 1 };
      const mockResult = { id: 1, firstName: 'sama' };
      
      const qb = mockEmployeeRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockEmployeeRepository.createQueryBuilder).toHaveBeenCalledWith('employee');
      expect(qb.andWhere).toHaveBeenCalledWith('employee.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();
      
      expect(realResult).toEqual(mockResult);
    })

    it('should return null (not send anything)',async ()=>{
      const findOneDto: FindOneDto = {};
      const mockResult = null;
      
      const qb = mockEmployeeRepository.createQueryBuilder();
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockEmployeeRepository.createQueryBuilder).toHaveBeenCalledWith('employee');

      expect(realResult).toEqual(mockResult);
    })

    it('should return null didnt find employee (wrong id)',async ()=>{
      const findOneDto: FindOneDto = { id: 0 };
      const mockResult = null;
      
      const qb = mockEmployeeRepository.createQueryBuilder();
      qb.getOne.mockResolvedValue(mockResult);
      
      const realResult = await service.findOne(findOneDto);
      
      expect(mockEmployeeRepository.createQueryBuilder).toHaveBeenCalledWith('employee');
      expect(qb.andWhere).toHaveBeenCalledWith('employee.id = :id', { id: findOneDto.id });
      expect(qb.getOne).toHaveBeenCalled();

      expect(realResult).toEqual(mockResult);
    })
  });

  describe('findAll',()=>{
    it('should return array(all employees objects)',async ()=>{
      const findAllDto: FindAllDto = {};
      const mockResult ={
        elements: [{id:1,firstName:'sama',lastName:'tounsi'}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockEmployeeRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockEmployeeRepository.createQueryBuilder).toHaveBeenCalledWith('employee');
      expect(qb.innerJoin).toHaveBeenCalledWith('employee.user', 'user');
      expect(paginateFunction.paginate).toHaveBeenCalled();


      expect(realResult).toEqual(mockResult);
    })

    it('should return employees (with isActive & firstName)',async ()=>{
      const findAllDto: FindAllDto = {isActive:1,name:'sama'};
      const mockResult ={
        elements: [{id:1,firstName:'sama',lastName:'tounsi',city:'damas'}],
        total: 1,
        page: 1,
        lastPage: 1,
      };
      
      const qb = mockEmployeeRepository.createQueryBuilder();
      jest.spyOn(paginateFunction, 'paginate').mockResolvedValue(mockResult);
      
      const realResult = await service.findAll(findAllDto);

      expect(mockEmployeeRepository.createQueryBuilder).toHaveBeenCalledWith('employee');
      expect(qb.innerJoin).toHaveBeenCalledWith('employee.user', 'user');
      expect(qb.andWhere).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: findAllDto.isActive });
      expect(qb.andWhere).toHaveBeenCalledWith('(employee.firstName LIKE :name OR employee.lastName LIKE :name)',{ name: `%${findAllDto.name}%` },);
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
