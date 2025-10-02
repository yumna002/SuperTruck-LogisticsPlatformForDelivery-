import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

describe('AddressesService', () => {
  let service: AddressesService;
  let mockAddressRepository: {
    createQueryBuilder: jest.Mock;
  };
  let mockUsersService: {};

  beforeEach(async () => {
    const mockQueryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      innerJoin: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{id:1,fullName:'sama',email:'e',city:'c',userId:2}]),
      getCount: jest.fn().mockResolvedValue(1),
    };

    mockAddressRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };
    
    mockUsersService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        { provide: getRepositoryToken(Address), useValue: mockAddressRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
