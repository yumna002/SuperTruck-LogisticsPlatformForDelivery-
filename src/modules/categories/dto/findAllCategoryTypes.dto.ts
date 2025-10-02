import { IsNotEmptyT } from "src/common/decorators/customValidators.decorator";



export class FindAllCategoryTypesDto{
    @IsNotEmptyT()
    categoryId:number
}
