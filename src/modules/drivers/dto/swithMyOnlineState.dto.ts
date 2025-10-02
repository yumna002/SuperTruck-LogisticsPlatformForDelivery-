import { IsNotEmptyT, IsNumberT, IsOptionalT } from 'src/common/decorators/customValidators.decorator';
import { Type } from 'class-transformer';



export class SwitchMyOnlineStateDto {
    @IsNumberT()
    @Type(()=>Number)
    @IsOptionalT()
    truckId?:number
}
