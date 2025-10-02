import { Type } from "class-transformer";
import { IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator";

export class GetDriversPaymentsListDto{
    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    page?: number = 1;

    @IsNumberT()
    @Type(() => Number)
    @IsOptionalT()
    limit?: number = 10;
}