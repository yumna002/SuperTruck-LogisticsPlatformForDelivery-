import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TruckModel } from './truck-model.entity';



@Entity()
export class FuelType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(/*{ unique: true }*/)
  name_en: string;

  @Column(/*{ unique: true }*/)
  name_ar: string;

  @Column({ type: 'double' })
  price: number;

  @OneToMany(() => TruckModel, truckModel => truckModel.fuelType)
  truckModels: TruckModel[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}
