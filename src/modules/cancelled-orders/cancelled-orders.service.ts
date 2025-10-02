import { Injectable } from '@nestjs/common';
import { CreateCancelledOrderDto } from './dto/create-cancelled-order.dto';
import { UpdateCancelledOrderDto } from './dto/update-cancelled-order.dto';

@Injectable()
export class CancelledOrdersService {
  create(createCancelledOrderDto: CreateCancelledOrderDto) {
    return 'This action adds a new cancelledOrder';
  }

  findAll() {
    return `This action returns all cancelledOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cancelledOrder`;
  }

  update(id: number, updateCancelledOrderDto: UpdateCancelledOrderDto) {
    return `This action updates a #${id} cancelledOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} cancelledOrder`;
  }
}
