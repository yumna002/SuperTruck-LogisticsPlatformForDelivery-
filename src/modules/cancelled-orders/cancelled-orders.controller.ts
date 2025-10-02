import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CancelledOrdersService } from './cancelled-orders.service';
import { CreateCancelledOrderDto } from './dto/create-cancelled-order.dto';
import { UpdateCancelledOrderDto } from './dto/update-cancelled-order.dto';

@Controller('cancelled-orders')
export class CancelledOrdersController {
  constructor(private readonly cancelledOrdersService: CancelledOrdersService) {}

  @Post()
  create(@Body() createCancelledOrderDto: CreateCancelledOrderDto) {
    return this.cancelledOrdersService.create(createCancelledOrderDto);
  }

  @Get()
  findAll() {
    return this.cancelledOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cancelledOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCancelledOrderDto: UpdateCancelledOrderDto) {
    return this.cancelledOrdersService.update(+id, updateCancelledOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cancelledOrdersService.remove(+id);
  }
}
