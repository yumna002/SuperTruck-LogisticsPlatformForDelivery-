import { Expose, Transform } from 'class-transformer';



export class FindOneItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  number: number;

  @Expose()
  fragility: number;

  @Expose()
  abilityToDisassemble: number;


  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar' ? obj.itemSize.name_ar : obj.itemSize.name_en;
  })
  itemSize: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar' ? obj.itemWeight.name_ar : obj.itemWeight.name_en;
  })
  itemWeight: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar' ? obj.categoryType.name_ar : obj.categoryType.name_en;
  })
  categoryType: string;

  @Expose()
  @Transform(({ obj }) => obj.categoryTypeId ?? null)
  categoryTypeId: number;

  @Expose()
  @Transform(({ obj }) => obj.categoryType?.categoryId ?? null)
  categoryId: number;

  @Expose()
  @Transform(({ obj, options }) => {
    const lang = (options as any).context?.lang || 'en';
    return lang === 'ar' ? obj.categoryType?.category?.name_ar : obj.categoryType?.category?.name_en;
  })
  categoryName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
