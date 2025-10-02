import { IsStringT } from "src/common/decorators/customValidators.decorator";



export class CreateSessionDto {
      @IsStringT()
      id : string;
}
