import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';
import { CreateDto } from './dto/create.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { UpdateDto } from './dto/update.dto';



@UseGuards(AuthGuard,RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService
  ) {}


  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('addItem')
  async addItem(@Body() createDto:CreateDto){
    const data=await this.itemsService.create(createDto);
    return {
      data:data,
      message:I18nKeys.successMessages.success
    }
  }

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.CUSTOMER)
  @Post('updateItem')
  async updateItem(@Body() updateDto:UpdateDto){
    const data=await this.itemsService.update(updateDto);
    return {
      data:data,
      message:I18nKeys.successMessages.updateSuccess
    }
  }
}
