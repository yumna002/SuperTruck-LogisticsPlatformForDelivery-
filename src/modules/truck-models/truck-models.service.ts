import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTruckModelDto } from './dto/create-truck-model.dto';
import { UpdateTruckModelDto } from './dto/update-truck-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TruckModel } from './entities/truck-model.entity';
import { Repository } from 'typeorm';
import { FindOneDto } from './dto/findOne.dto';
import { FindAllDto } from './dto/findAll.dto';
import { I18nKeys } from 'src/common/i18n/i18n-keys';
import { join, resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { TrucksService } from '../trucks/trucks.service';
import { Transactional } from 'typeorm-transactional';
import { FuelType } from './entities/fuel-type.entity';
import { SizeType } from './entities/size-type.entity';
import { VehicleType } from './entities/vehicle-type.entity';
import { UpdateFuelPricesDto } from './dto/udpateFuelPrices.dto';



@Injectable()
export class TruckModelsService {
  constructor(
    @InjectRepository(TruckModel) private readonly truckModelRepository: Repository<TruckModel>,
    @InjectRepository(FuelType) private readonly fuelTypeRepository: Repository<FuelType>,
    @InjectRepository(SizeType) private readonly sizeTypeRepository: Repository<SizeType>,
    @InjectRepository(VehicleType) private readonly vehicleTypeRepository: Repository<VehicleType>,
    private readonly trucksService:TrucksService,
  ) {}


  async createTruckModel(createTruckModelDto: CreateTruckModelDto) {
    const isExist=await this.isExistTruckModel({brand:createTruckModelDto.brand,model:createTruckModelDto.model,year:createTruckModelDto.year});
    if(isExist){
      throw new ConflictException(I18nKeys.exceptionMessages.alreadyExistException);
    }

    const truckModel=await this.truckModelRepository.save({
      ...createTruckModelDto,
      vehicleType:{id:createTruckModelDto.vehicleTypeId},
      sizeType:{id:createTruckModelDto.sizeTypeId},
      fuelType:{id:createTruckModelDto.fuelTypeId}
    })

    return truckModel;
  }

  async updateTruckModel(updateTruckModelDto:UpdateTruckModelDto) {
    const truckModel = await this.getOneTruckModelIfExist({ id: updateTruckModelDto.id });

    Object.keys(updateTruckModelDto).forEach((key) => {
      if (updateTruckModelDto[key] != null && key !== 'id') {
        if(key=='photo'){
          // Remove old photo if it exists
          if (truckModel.photo) {
            const oldPath = truckModel.photo
            if (existsSync(oldPath)) {
              unlinkSync(oldPath);
            }
          }
        }
        truckModel[key] = updateTruckModelDto[key];
      }
    });

    await this.truckModelRepository.save(truckModel);
    return truckModel;
  }

  async findAll(findAllDto:FindAllDto) {
    const qb = this.truckModelRepository.createQueryBuilder('truckModel');
    
    qb.leftJoinAndSelect('truckModel.sizeType', 'sizeType');
    qb.leftJoinAndSelect('truckModel.vehicleType', 'vehicleType');
    qb.leftJoinAndSelect('truckModel.fuelType', 'fuelType');

    if (findAllDto.brand != null) {
      qb.andWhere('truckModel.brand LIKE :brand', { brand: `%${findAllDto.brand}%` });
    }

    if (findAllDto.model != null) {
      qb.andWhere('truckModel.model LIKE :model', { model: `%${findAllDto.model}%` });
    }

    if (findAllDto.year != null) {
      qb.andWhere('truckModel.year = :year', { year: findAllDto.year });
    }

    if (findAllDto.vehicleTypeId != null) {
      qb.andWhere('truckModel.vehicleTypeId = :vehicleTypeId', { vehicleTypeId: findAllDto.vehicleTypeId });
    }

    if (findAllDto.sizeTypeId != null) {
      qb.andWhere('truckModel.sizeTypeId = :sizeTypeId', { sizeTypeId: findAllDto.sizeTypeId });
    }

    if (findAllDto.fuelTypeId != null) {
      qb.andWhere('truckModel.fuelTypeId = :fuelTypeId', { fuelTypeId: findAllDto.fuelTypeId });
    }

    return await qb.getMany();
  }

  async findOne(findOneDto:FindOneDto):Promise<TruckModel|null> {
    const qb = this.truckModelRepository.createQueryBuilder('truckModel');
    let ok = 1;
    
    qb.leftJoinAndSelect('truckModel.sizeType', 'sizeType');
    qb.leftJoinAndSelect('truckModel.vehicleType', 'vehicleType');
    qb.leftJoinAndSelect('truckModel.fuelType', 'fuelType');

    if (findOneDto.id != null) {
      ok = 0;
      qb.andWhere('truckModel.id = :id', { id: findOneDto.id });
    }

    if (findOneDto.brand != null) {
      ok = 0;
      qb.andWhere('truckModel.brand = :brand', { brand: findOneDto.brand });
    }

    if (findOneDto.model != null) {
      ok = 0;
      qb.andWhere('truckModel.model = :model', { model: findOneDto.model });
    }

    if (findOneDto.year != null) {
      ok = 0;
      qb.andWhere('truckModel.year = :year', { year: findOneDto.year });
    }

    if (findOneDto.vehicleTypeId != null) {
      ok = 0;
      qb.andWhere('truckModel.vehicleTypeId = :vehicleTypeId', { vehicleTypeId: findOneDto.vehicleTypeId });
    }

    if (findOneDto.sizeTypeId != null) {
      ok = 0;
      qb.andWhere('truckModel.sizeTypeId = :sizeTypeId', { sizeTypeId: findOneDto.sizeTypeId });
    }

    if (findOneDto.fuelTypeId != null) {
      ok = 0;
      qb.andWhere('truckModel.fuelTypeId = :fuelTypeId', { fuelTypeId: findOneDto.fuelTypeId });
    }

    if (ok) return null;

    return await qb.getOne();
  }

  @Transactional()
  async deleteTruckModel(findOneDto:FindOneDto) {
    //get the truck model
    const truckModel=await this.getOneTruckModelIfExist(findOneDto);

    let used=true;
    const trucks = await this.trucksService.findAll({ truckModelId: truckModel.id});
    if(trucks.length==0)used=false;

    //if(used) => can't delete
    if(used){
      throw new Error(I18nKeys.exceptionMessages.usedException)
    }

    if (truckModel.photo) {
    const photoPath = truckModel.photo
    if (existsSync(photoPath)) unlinkSync(photoPath); 
    }
    await this.truckModelRepository.delete(truckModel.id)

    return {};
  }

  async getOneTruckModelIfExist(findOneDto: FindOneDto):Promise<TruckModel> {
    const truckModel=await this.findOne(findOneDto);
    if(!truckModel){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return truckModel;
  }

  async isExistTruckModel(findOneDto: FindOneDto):Promise<Boolean> {
    const truckModel=await this.findOne(findOneDto);
    if(!truckModel)return false;
    else return true;
  }

  async getFuelTypes(){
    return await this.fuelTypeRepository.find();
  }

  async getFuelTypeByIdIfExist(id:number){
    const fuel= await this.fuelTypeRepository.findOneBy({id:id});
    if(!fuel){
      throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
    }
    return fuel;
  }

  async getSizeTypes(){
    return await this.sizeTypeRepository.find();
  }

  async getVehicleTypes(){
    return await this.vehicleTypeRepository.find();
  }

  async updateFuelPrices(updateFuelPricesDto:UpdateFuelPricesDto){
    await this.fuelTypeRepository.update(
      {name_en : 'gasoline'},
      {price:updateFuelPricesDto.gasolinePrice}
    );
    await this.fuelTypeRepository.update(
      {name_en : 'diesel'},
      {price : updateFuelPricesDto.dieselPrice}
    )
    const gasoline = await this.fuelTypeRepository.findOne({
      where: { name_en: 'gasoline' },
    });

    const diesel = await this.fuelTypeRepository.findOne({
      where: { name_en: 'diesel' },
    });

    console.log(gasoline);
    return{
      gasolinePrice:gasoline?.price,
      dieselPrice:diesel?.price
    }
    
  }

  async getFuelData(){
    const data=await this.fuelTypeRepository.find();
    return data;
  }
}
