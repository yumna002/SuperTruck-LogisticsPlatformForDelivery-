import { Type } from 'class-transformer';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';



export class FindAllDto {
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    customerId?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    isActive?: number;
}
