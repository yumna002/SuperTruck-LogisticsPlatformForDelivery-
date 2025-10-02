import { IsNotEmpty, IsString, IsEnum, isNumber } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { PartialType } from '@nestjs/mapped-types';
import { FindAllDto } from 'src/modules/orders/dto/findAll.dto';



export class FindAllProcessigDto extends PartialType(FindAllDto) {}
