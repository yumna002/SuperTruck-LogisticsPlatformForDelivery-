import { Injectable } from '@nestjs/common';
import { FindAllRejectReasonDto } from './dto/findAllRejectReason.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RejectReason } from './entities/reject-reason.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { RejectedOrder } from './entities/rejected-order.entity';



@Injectable()
export class RejectedOrdersService {
  constructor(
    @InjectRepository(RejectReason) private readonly rejectReasonRepository: Repository<RejectReason>,
    @InjectRepository(RejectedOrder) private readonly rejectedOrderRepository: Repository<RejectedOrder>,
  ){}


  async findAllRejectReasons(findAllRejectReasonDto:FindAllRejectReasonDto) {
    const qb = this.rejectReasonRepository.createQueryBuilder('rejectReason');

    return await qb.getMany();
  }

  async create(createDto:CreateDto){
    const rejectedOrder=await this.rejectedOrderRepository.save({
      order:{id:createDto.orderId},
      driver:{id:createDto.driverId},
      rejectReason:{id:createDto.rejectReasonId}
    })

    return rejectedOrder
  }
}
