import { IsNotEmpty, IsString, IsEnum, isNumber } from 'class-validator';
import { AccountPasswordRuleT, IsEnumT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';
import { OrderStateEnum } from 'src/common/enums/orderState';
import { PartialType } from '@nestjs/mapped-types';
import { FindAllDto } from 'src/modules/orders/dto/findAll.dto';



export class CreateProcessingOrderDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    orderId:number

    @IsNotEmptyT()
    expectedPrice:number

    @IsNotEmptyT()
    expectedTime:number

    @IsStringT()
    @IsNotEmptyT()
    state:string

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    driverId:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()    
    truckId:number
}
