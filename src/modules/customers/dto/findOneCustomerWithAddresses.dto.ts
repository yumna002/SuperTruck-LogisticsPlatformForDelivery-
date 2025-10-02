import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT, PhoneNumberRuleT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class FindOneCustomerWithAddressesDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    id: number;
}
