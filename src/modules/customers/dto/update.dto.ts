import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    id: number;

    @IsStringT()
    @IsOptionalT()
    fullName?: string;

    @IsEmailT()
    @IsStringT()
    @IsOptionalT()
    email?: string;

    @IsOptionalT()
    birthdate?: Date;
}
