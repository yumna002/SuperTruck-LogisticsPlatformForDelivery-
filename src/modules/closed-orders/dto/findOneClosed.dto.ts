import { PartialType } from "@nestjs/mapped-types";
import { FindOneDto } from "src/modules/orders/dto/findOne.dto";



export class FindOneClosedDto extends PartialType(FindOneDto){}
