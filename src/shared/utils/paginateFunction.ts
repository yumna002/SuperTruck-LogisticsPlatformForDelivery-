import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';



interface PaginateOptions {
  page?: number;
  limit?: number;
}


export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  options: PaginateOptions,
) {
  const page = options.page || 1;
  const limit = options.limit || 10;

  const [elements, total] = await Promise.all([
    qb.skip((page - 1) * limit)
      .take(limit)
      .getMany(),
    qb.getCount(),
  ]);

  return {
    elements,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}
