import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { FindOneDto } from './dto/findOne.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { FindAllDto } from './dto/findAll.dto';
import { UpdateDto } from './dto/update.dto';
import { CreateDto } from './dto/create.dto';



@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck) private readonly truckRepository: Repository<Truck>,
    @Inject(REQUEST) private request: Request,
  ) {}


  async create(createDto:CreateDto) {
    const isExist=await this.isExist({plateNumber:createDto.plateNumber});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const newTruck=await this.truckRepository.save({
      plateNumber:createDto.plateNumber,
      color:createDto.color,
      details:createDto.details,
      truckModel:{id:createDto.truckModelId},
      driver:{id:createDto.driverId},
      isActive:1,
      isAvailable:0,
    });

    return newTruck;
  }

  async findAll(findAllDto: FindAllDto) {
    const qb = this.truckRepository.createQueryBuilder('truck');

    qb.innerJoin('truck.driver', 'driver');
    qb.leftJoinAndSelect('truck.truckModel', 'truckModel');// fetch full truckModel object

    if (findAllDto.driverId != null) {
      qb.andWhere('truck.driverId = :driverId', { driverId: findAllDto.driverId });
    }

    if (findAllDto.truckModelId != null) {
      qb.andWhere('truck.truckModelId = :truckModelId', { truckModelId: findAllDto.truckModelId });
    }

    if (findAllDto.isActive != null) {
      qb.andWhere('truck.isActive = :isActive', { isActive: findAllDto.isActive });
    }

    if (findAllDto.isAvailable != null) {
      qb.andWhere('truck.isAvailable = :isAvailable', { isAvailable: findAllDto.isAvailable });
    }

    if (findAllDto.truckModelIds !=null) {
      if (findAllDto.truckModelIds.length > 0) {
        qb.andWhere('truck.truckModelId IN (:...ids)', { ids: findAllDto.truckModelIds });
      } else {
        // Empty array -> force no results
        qb.andWhere('1 = 0');
      }
    }


    return await qb.getMany();
  }

  async findOne(findOneDto: FindOneDto):Promise<Truck|null> {
    const qb = this.truckRepository.createQueryBuilder('truck');
    qb.leftJoinAndSelect('truck.truckModel','truckModel')
    let ok=1;

    if (findOneDto.id!=null) {
      ok=0;
      qb.andWhere('truck.id = :id', { id: findOneDto.id });
    }
    if(findOneDto.driverId!=null) {
      ok=0;
      qb.andWhere('truck.driverId = :driverId' , { driverId:findOneDto.driverId})
    }
    if(findOneDto.isAvailable!=null){
      ok=0;
      qb.andWhere('truck.isAvailable = :isAvailable', { isAvailable:findOneDto.isAvailable})
    }
    if(findOneDto.truckModelId!=null){
      ok=0;
      qb.andWhere('truck.truckModelId = :truckModelId', { truckModelId:findOneDto.truckModelId})
    }
    if(findOneDto.plateNumber!=null){
      ok=0;
      qb.andWhere('truck.plateNumber = :plateNumber', { plateNumber:findOneDto.plateNumber})
    }
    if(findOneDto.isActive!=null){
      ok=0;
      qb.andWhere('truck.isActive = :isActive', { isActive:findOneDto.isActive})
    }
    if(findOneDto.sizeTypeId!=null){
      ok=0;
      qb.andWhere('truckModel.sizeTypeId = :sizeTypeId', { sizeTypeId:findOneDto.sizeTypeId})
    }
    if(findOneDto.vehicleTypeId!=null){
      ok=0;
      qb.andWhere('truckModel.vehicleTypeId = :vehicleTypeId', { vehicleTypeId:findOneDto.vehicleTypeId})
    }
    
    if(ok)return null;
    
    return await qb.getOne();
  }

  async update(updateDto:UpdateDto) {
    const truck = await this.getOneIfExist({ id: updateDto.id });

    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] != null && key !== 'id') {
        truck[key] = updateDto[key];
      }
    });

    await this.truckRepository.save(truck);
    return truck;
  }

  async getOneIfExist(findOneDto: FindOneDto):Promise<Truck> {
    const truck=await this.findOne(findOneDto);
    if(!truck){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return truck;
  }

  async isExist(findOneDto: FindOneDto):Promise<Boolean> {
    const truck=await this.findOne(findOneDto);
    if(!truck)return false;
    else return true;
  }

  async delete(findOneDto:FindOneDto) {
    const truck=await this.getOneIfExist({id:findOneDto.id,isActive:1});
    
    await this.update({id:truck.id,isActive:0});

    return{};
  }

  async getTruckOptions(){
    const trucks = await this.truckRepository.find({
      relations: ['truckModel', 'truckModel.vehicleType', 'truckModel.sizeType'],
    });

    // Use a Map to store combinations, mapping a unique string key to the desired object
    const combinationsMap = new Map<string, { sizeTypeId: number; sizeTypeName_en: string;sizeTypeName_ar: string; vehicleTypeId: number; vehicleTypeName_en: string;vehicleTypeName_ar: string }>();

    for (const truck of trucks) {
      const sizeType = truck.truckModel?.sizeType;
      const vehicleType = truck.truckModel?.vehicleType;

      if (sizeType && vehicleType) {
        // Create a unique key using the IDs to ensure uniqueness
        const key = `${sizeType.id}-${vehicleType.id}`;

        // Store the full object with both id and name
        if (!combinationsMap.has(key)) { // Only add if it's a new combination
          combinationsMap.set(key, {
            sizeTypeId: sizeType.id,
            sizeTypeName_en: sizeType.name_en,
            sizeTypeName_ar: sizeType.name_ar,
            vehicleTypeId: vehicleType.id,
            vehicleTypeName_en: vehicleType.name_en,
            vehicleTypeName_ar: vehicleType.name_ar
          });
        }
      }
    }

    // Convert map values into an array of objects
    const uniqueCombinations = Array.from(combinationsMap.values());

    return uniqueCombinations;
  }
}
