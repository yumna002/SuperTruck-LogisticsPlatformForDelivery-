import { Test, TestingModule } from '@nestjs/testing';
import { RejectedOrdersService } from './rejected-orders.service';

describe('RejectedOrdersService', () => {
  let service: RejectedOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RejectedOrdersService],
    }).compile();

    service = module.get<RejectedOrdersService>(RejectedOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
