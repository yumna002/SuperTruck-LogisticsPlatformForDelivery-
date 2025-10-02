import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindOneDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    id?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    orderId?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    itemSizeId?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    itemWeightId?: number;
}
