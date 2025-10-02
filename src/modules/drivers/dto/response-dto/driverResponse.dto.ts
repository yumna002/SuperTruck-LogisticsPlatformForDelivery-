import { Type } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";
import { IsNotEmptyT, IsNumberT, IsOptionalT } from "src/common/decorators/customValidators.decorator";



export class DriverResponse {
  @IsNumberT()
  @Type(() => Number)
  @IsNotEmptyT()
  orderId: number;

  accepted: boolean;

  @IsNumberT()
  @Type(() => Number)
  @IsOptionalT()
  rejectReasonId?:number
}
