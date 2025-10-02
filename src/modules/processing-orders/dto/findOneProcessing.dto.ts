import { PartialType } from "@nestjs/mapped-types";
import { FindOneDto } from "src/modules/orders/dto/findOne.dto";



export class FindOneProcessingDto extends PartialType(FindOneDto){}
