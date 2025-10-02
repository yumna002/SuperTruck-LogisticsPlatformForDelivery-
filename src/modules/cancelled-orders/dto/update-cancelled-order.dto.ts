import { PartialType } from '@nestjs/mapped-types';
import { CreateCancelledOrderDto } from './create-cancelled-order.dto';

export class UpdateCancelledOrderDto extends PartialType(CreateCancelledOrderDto) {}
