import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TruckModel } from "./truck-model.entity";
import { Order } from "src/modules/orders/entities/order.entity";



@Entity()
export class VehicleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(/*{ unique: true }*/)
  name_en: string;

  @Column(/*{ unique: true }*/)
  name_ar: string;

  @OneToMany(() => Order, (order) => order.vehicleType)
  orders: Order[];

  @OneToMany(() => TruckModel, truckModel => truckModel.vehicleType)
  truckModels: TruckModel[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}
