import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingOrdersService } from './processing-orders.service';

describe('ProcessingOrdersService', () => {
  let service: ProcessingOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessingOrdersService],
    }).compile();

    service = module.get<ProcessingOrdersService>(ProcessingOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
