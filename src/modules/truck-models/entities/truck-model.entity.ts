import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, RelationId, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SizeType } from './size-type.entity';
import { FuelType } from './fuel-type.entity';
import { VehicleType } from './vehicle-type.entity';
import { Truck } from 'src/modules/trucks/entities/truck.entity';



@Entity()
export class TruckModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column({ type: 'double' }) 
  width: number;

  @Column({ type: 'double' })
  height: number;

  @Column({ type: 'double' })
  length: number;

  
  @Column({ type: 'double' })
  maximumWeightCapacity: number;

  @Column({nullable: true, default: null})
  photo: string;

  @Column({ type: 'double' })
  fuelConsumption: number;

  @Column({default: ''/*, type: 'text' */})
  details: string;

  @ManyToOne(() => SizeType, { eager: false, nullable: false })
  @JoinColumn({name : 'sizeTypeId'})
  sizeType: SizeType;

  @RelationId((truckModel: TruckModel) => truckModel.sizeType)
  sizeTypeId: number;

  @ManyToOne(() => FuelType, { eager: false, nullable: false })
  @JoinColumn({name : 'fuelTypeId'})
  fuelType: FuelType;

  @RelationId((truckModel: TruckModel) => truckModel.fuelType)
  fuelTypeId: number;

  @ManyToOne(() => VehicleType, { eager: false, nullable: false })
  @JoinColumn({name : 'vehicleTypeId'})
  vehicleType: VehicleType;

  @RelationId((truckModel: TruckModel) => truckModel.vehicleType)
  vehicleTypeId: number;

  @OneToMany(() => Truck, truck => truck.truckModel)
  truck: Truck[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}
