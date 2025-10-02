import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType } from './entities/category-type.entity';
import { REQUEST } from '@nestjs/core';
import { Category } from './entities/category.entity';
import { FindOneCategoryDto } from './dto/findOneCategory.dto';
import { FindOneCategoryTypeDto } from './dto/findOneCategoryType.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindAllCategoryTypesDto } from './dto/findAllCategoryTypes.dto';
import { FindAllCategoryDto } from './dto/findAllCategory.dto';



@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryType) private readonly categoryTypeRepository: Repository<CategoryType>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST) private request: Request,
    //private readonly usersService: UsersService,
  ) {}


  async findOneCategory(findOneCategoryDto: FindOneCategoryDto):Promise<Category|null> {
    const qb = this.categoryRepository.createQueryBuilder('category');
    let ok=1;

    if (findOneCategoryDto.id!=null) {
      ok=0;
      qb.andWhere('category.id = :id', { id: findOneCategoryDto.id });
    }

    if (findOneCategoryDto.name!=null) {
      ok=0;
      qb.andWhere('category.name = :name', { name: findOneCategoryDto.name });
    }

    if(ok)return null;
    
    return await qb.getOne();
  }

  async findOneCategoryType(findOneCategoryTypeDto: FindOneCategoryTypeDto):Promise<CategoryType|null> {
    const qb = this.categoryTypeRepository.createQueryBuilder('categoryType');
    let ok=1;

    if (findOneCategoryTypeDto.id!=null) {
      ok=0;
      qb.andWhere('categoryType.id = :id', { id: findOneCategoryTypeDto.id });
    }

    if (findOneCategoryTypeDto.name!=null) {
      ok=0;
      qb.andWhere('categoryType.name = :name', { name: findOneCategoryTypeDto.name });
    }
    
    if(findOneCategoryTypeDto.categoryId!=null){
      ok=0;
      qb.andWhere('categoryType.categoryId = :categoryId', { categoryId: findOneCategoryTypeDto.categoryId });
    }
    if(ok)return null;
    
    return await qb.getOne();
  }

  async getOneIfExistCategory(findOneCategoryDto: FindOneCategoryDto):Promise<Category> {
    const category=await this.findOneCategory(findOneCategoryDto);
    if(!category){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return category;
  }

  async getOneIfExistCategoryType(findOneCategoryTypeDto: FindOneCategoryTypeDto):Promise<CategoryType> {
    const categoryType=await this.findOneCategoryType(findOneCategoryTypeDto);
    if(!categoryType){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return categoryType;
  }

  async isExistCategory(findOneCategoryDto: FindOneCategoryDto):Promise<Boolean> {
    const category=await this.findOneCategory(findOneCategoryDto);
    if(!category)return false;
    else return true;
  }

  async isExistCategoryType(findOneCategoryTypeDto: FindOneCategoryTypeDto):Promise<Boolean> {
    const categoryType=await this.findOneCategoryType(findOneCategoryTypeDto);
    if(!categoryType)return false;
    else return true;
  }

  async findAllCategory(findAllCategoryDto:FindAllCategoryDto){
    const qb = this.categoryRepository.createQueryBuilder('category');

    return await qb.getMany();
  }

  async findAllCategoryTypes(findAllCategoryTypesDto:FindAllCategoryTypesDto){
    const qb = this.categoryTypeRepository.createQueryBuilder('categoryType');

    if (findAllCategoryTypesDto.categoryId!=null) {
      qb.andWhere('categoryType.categoryId = :categoryId', { categoryId: findAllCategoryTypesDto.categoryId });
    }

    return await qb.getMany();
  }
}
