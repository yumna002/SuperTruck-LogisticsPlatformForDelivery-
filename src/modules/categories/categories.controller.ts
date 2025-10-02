import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindAllCategoryTypesDto } from './dto/findAllCategoryTypes.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { LanguageInterceptor } from 'src/common/interceptors/language.interceptor';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { GetCategoriesListResponseDto } from './dto/response/getCategoriesListResponse.dto';
import { REQUEST } from '@nestjs/core';
import { GetCategoryTypesListResponseDto } from './dto/response/getCategoryTypesListResponse.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(REQUEST) private readonly request : Request

  ) {}


  //@UseInterceptors(LanguageInterceptor)
  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER)
  @Get('getCategoriesList')
  async getCategoriesList(){
    const lang=this.request.headers['accept-language'] || 'en'
    const data= await this.categoriesService.findAllCategory({})
    const filteredData=plainToInstance(GetCategoriesListResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE,RoleTypeEnum.FINANCE_MANAGER_EMPLOYEE,RoleTypeEnum.ORDER_MANAGER_EMPLOYEE,RoleTypeEnum.CUSTOMER)
  @Post('getCategoryTypesList')
  async getCategoryTypesList(@Body() findAllCategoryTypesDto:FindAllCategoryTypesDto){

    const lang=this.request.headers['accept-language'] || 'en'
    const data= await this.categoriesService.findAllCategoryTypes(findAllCategoryTypesDto);
    const filteredData=plainToInstance(GetCategoryTypesListResponseDto,data,{
      excludeExtraneousValues:true,
      context: { lang },
        } as ClassTransformOptions & { context?: any }
    )
    return {
      data:filteredData,
      message:I18nKeys.successMessages.getListSuccess
    }
  }
}
