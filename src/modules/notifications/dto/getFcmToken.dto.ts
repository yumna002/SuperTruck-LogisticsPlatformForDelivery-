import { Type } from "class-transformer";
import { IsNotEmptyT, IsNumberT, IsStringT } from "src/common/decorators/customValidators.decorator";



export class GetFcmTokenDto {
  @IsStringT()
  @IsNotEmptyT()
  fcmToken: string;
}
