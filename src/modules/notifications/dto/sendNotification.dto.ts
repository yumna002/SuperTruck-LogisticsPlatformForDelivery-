import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { IsNotEmptyT, IsNumberT, IsOptionalT, IsStringT } from "src/common/decorators/customValidators.decorator";



export class SendNotificationDto {
    @IsNumberT()
    @Type(() => Number)
    @IsNotEmpty()
    userId: number

    @IsStringT()
    @IsNotEmptyT()
    body: string;

    @IsStringT()
    @IsNotEmptyT()
    title: string;
}
