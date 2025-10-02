import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { I18nKeys } from 'src/common/i18n/i18n-keys';



@Controller('database')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('refreshDB')
    async refreshDB() {
      await this.databaseService.refreshDB();
      return {
        data: {},
        message: I18nKeys.successMessages.success
      }
  }
}
