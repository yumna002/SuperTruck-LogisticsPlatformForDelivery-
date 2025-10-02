import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { IsEmailT, IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class UpdateDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmptyT()
    id: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    number?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    abilityToDisassemble?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    fragility?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    itemSizeId?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    itemWeightId?: number;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    categoryTypeId?: number;
}
