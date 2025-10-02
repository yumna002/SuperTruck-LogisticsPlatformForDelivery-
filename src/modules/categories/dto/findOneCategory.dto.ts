import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindOneCategoryDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    id?: number;

    @IsStringT()
    @IsOptionalT()
    name?: string;
}
