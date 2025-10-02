import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    id: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    isActive?:number

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    latitude?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    longitude?: number;

    @IsStringT()
    @IsOptionalT()
    googlePlaceId?: string;
}
