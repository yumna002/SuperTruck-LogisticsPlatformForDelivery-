import { Expose, Transform } from "class-transformer";

export class TopTenRatedDto{
    @Expose()
    id:number

    @Expose()
    @Transform((({ obj }) => obj.firstName + " " + obj.lastName))
    name:string

    @Expose()
    rate:number
}