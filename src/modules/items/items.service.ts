import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Item } from './entities/item.entity';
import { ItemSize } from './entities/item-size.entity';
import { ItemWeight } from './entities/item-weight.entity';
import { Repository } from 'typeorm';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';



@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemSize) private readonly itemSizeRepository: Repository<ItemSize>,
    @InjectRepository(ItemWeight) private readonly itemWeightRepository: Repository<ItemWeight>,
    @Inject(REQUEST) private request: Request,
    //private readonly usersService: UsersService,
  ) {}

  
  async findAll(findAllDto:FindAllDto) {
    const qb = this.itemRepository.createQueryBuilder('item');

    qb.leftJoinAndSelect('item.itemSize', 'itemSize');
    qb.leftJoinAndSelect('item.itemWeight', 'itemWeight');

    if (findAllDto.itemSizeId!=null) {
      qb.andWhere('item.itemSizeId = :itemSizeId', { itemSizeId: findAllDto.itemSizeId });
    }

    if (findAllDto.itemWeightId!=null) {
      qb.andWhere('item.itemWeightId = :itemWeightId', { itemWeightId: findAllDto.itemWeightId });
    }
    
    if(findAllDto.orderId!=null){
      qb.andWhere('item.orderId = :orderId', { orderId: findAllDto.orderId });
    }

    return await qb.getMany();
  }

  async findOne(findOneDto: FindOneDto):Promise<Item|null> {
    const qb = this.itemRepository.createQueryBuilder('item');
    qb.leftJoinAndSelect('item.categoryType', 'categoryType');
    qb.leftJoinAndSelect('categoryType.category', 'category');

    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('item.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.itemSizeId!=null) {
      ok=0;
      qb.andWhere('item.itemSizeId = :itemSizeId', { itemSizeId: findOneDto.itemSizeId });
    }

    if (findOneDto.itemWeightId!=null) {
      ok=0;
      qb.andWhere('item.itemWeightId = :itemWeightId', { itemWeightId: findOneDto.itemWeightId });
    }
    
    if(findOneDto.orderId!=null){
      ok=0;
      qb.andWhere('item.orderId = :orderId', { orderId: findOneDto.orderId });
    }
    if(ok)return null;
    
    return await qb.getOne();
  }

  async create(createDto:CreateDto) {
    const isExist=await this.isExist({});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }
    
    const newItem=await this.itemRepository.save({
      number:createDto.number,
      fragility:createDto.fragility,
      abilityToDisassemble:createDto.abilityToDisassemble,
      itemSize:{id:createDto.itemSizeId},
      itemWeight:{id:createDto.itemWeightId},
      order:{id:createDto.orderId},
      categoryType:{id:createDto.categoryTypeId},
    })

    return newItem;
  }

  async update(updateDto:UpdateDto) {
    const item = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        item[key] = updateDto[key];
      }
    });

    await this.itemRepository.save(item);
    return item;
  }
  
  async getOneIfExist(findOneDto: FindOneDto):Promise<Item> {
    const item=await this.findOne(findOneDto);
    if(!item){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return item;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const item=await this.findOne(findOneDto);
    if(!item)return false;
    else return true;
  }

  async deleteItems(findAllDto:FindAllDto){
    await this.itemRepository.delete({order:{id:findAllDto.orderId}});
  }
}
