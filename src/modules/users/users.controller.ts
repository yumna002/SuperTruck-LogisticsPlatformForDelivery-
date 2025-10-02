import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateDto } from './dto/update.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { I18nService } from 'nestjs-i18n';
import { RolesGuard } from 'src/common/guards/authorization.guard';
import { AuthGuard } from 'src/common/guards/authentication.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleTypeEnum } from 'src/common/enums/roleType';



@UseGuards(AuthGuard,RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  @Roles(RoleTypeEnum.ADMIN,RoleTypeEnum.ACCOUNT_MANAGER_EMPLOYEE)
  @Post('switchActiveState')
  async switchActiveState(@Body() updateDto: UpdateDto) {
    updateDto.isActive=1;
    const data=await this.usersService.update(updateDto);
    return {
      data: {},
      message: I18nKeys.successMessages.switchActiveStateSuccess
    }
  }
}
