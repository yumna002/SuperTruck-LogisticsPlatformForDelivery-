import { Driver } from 'src/modules/drivers/entities/driver.entity';
import { ProcessingOrder } from 'src/modules/processing-orders/entities/processing-order.entity';
import { ScheduledOrder } from 'src/modules/scheduled-orders/entities/scheduled-order.entity';
import { TruckModel } from 'src/modules/truck-models/entities/truck-model.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, RelationId, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';



@Entity()
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  plateNumber: string;

  @Column(/*{type:'enum', enum:ColorEnum}*/)
  color: string;

  @Column({default: 0})
  isAvailable: number;

  @Column({default: 1}) 
  isActive: number;

  @Column({default: ''/*, type: 'text' */})
  details: string;

  @ManyToOne(() => TruckModel, { eager: false, nullable: false })
  @JoinColumn({name : 'truckModelId'})
  truckModel: TruckModel;

  @RelationId((truck: Truck) => truck.truckModel)
  truckModelId: number;

  @ManyToOne(() => Driver, { eager: false, nullable: false })
  @JoinColumn({name : 'driverId'})
  driver: Driver;

  @RelationId((truck: Truck) => truck.driver)
  driverId: number;

  @OneToMany(() => ProcessingOrder, (processingOrder) => processingOrder.truck)
  processingOrders: ProcessingOrder[];

  @OneToMany(() => ScheduledOrder, (scheduledOrder) => scheduledOrder.truck)
  scheduledOrders: ScheduledOrder[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;
}
