import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PendingOrdersService } from './pending-orders.service';
import { CreatePendingOrderDto } from './dto/create-pending-order.dto';
import { UpdatePendingOrderDto } from './dto/update-pending-order.dto';



@Controller('pending-orders')
export class PendingOrdersController {
  constructor(private readonly pendingOrdersService: PendingOrdersService) {}

  
}
