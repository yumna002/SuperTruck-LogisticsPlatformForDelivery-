import { IsNotEmpty, IsString, IsEnum, IsNumber, IsPhoneNumber, isNotEmpty } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class ConfirmOrderDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    id: number;

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    paymentTypeId: number;

    @IsStringT()
    @IsNotEmptyT()
    expectedTime:string

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    expectedPrice:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    distance:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    holdersProfit:number

    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    driverProfit:number

}
