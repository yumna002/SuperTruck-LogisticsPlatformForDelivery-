import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './entities/category-type.entity';
import { UsersModule } from '../users/users.module';



@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Category]), TypeOrmModule.forFeature([CategoryType])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
