import { IsStringT } from "src/common/decorators/customValidators.decorator";



export class GetQrDto{
    @IsStringT()
    id : string;
}
