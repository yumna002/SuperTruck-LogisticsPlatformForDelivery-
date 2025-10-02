import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Truck } from "src/modules/trucks/entities/truck.entity";
import { Column, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class ProcessingOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    expectedPrice: number;

    @Column()
    expectedTime: number;

    @Column({ type: 'double' ,default: 0})
    currDistance: number; //in km
    
    @Column({default: 0})
    currTime: number; //in seconds

    @Column()
    state : string;

    @ManyToOne(() => Order, (order) => order.processingOrders)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @RelationId((processingOrder: ProcessingOrder) => processingOrder.order)
    orderId: number;

    @ManyToOne(() => Driver, (driver) => driver.processingOrders)
    @JoinColumn({ name: 'driverId' })
    driver: Driver;

    @RelationId((processingOrder: ProcessingOrder) => processingOrder.driver)
    driverId: number;

    @ManyToOne(() => Truck, (truck) => truck.processingOrders)
    @JoinColumn({ name: 'truckId' })
    truck: Truck;

    @RelationId((processingOrder: ProcessingOrder) => processingOrder.truck)
    truckId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
