import { IsStringT } from "src/common/decorators/customValidators.decorator";



export class SendMessageDto {
    @IsStringT()
    id:string

    @IsStringT()
    recieverNumber:string

    @IsStringT()
    message:string
}
