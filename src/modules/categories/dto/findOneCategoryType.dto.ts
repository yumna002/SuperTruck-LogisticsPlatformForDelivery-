import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindOneCategoryTypeDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    id?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    categoryId?: number;

    @IsStringT()
    @IsOptionalT()
    name?: string;
}
