import { Expose, Transform } from "class-transformer";

export class GetRejectReasonsResponseDto{
    @Expose()
    id:number

    @Expose()
    @Transform(({ obj, options }) => {
    const lang = (options as any)?.context?.lang || 'en';
    return obj[`name_${lang}`];
    })
    reason: string;
}