import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Truck } from "src/modules/trucks/entities/truck.entity";
import { Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";



@Entity()
export class ScheduledOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    expectedPrice: number;

    @Column()
    expectedTime: number;

    @ManyToOne(() => Order, (order) => order.scheduledOrders)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @RelationId((scheduledOrder: ScheduledOrder) => scheduledOrder.order)
    orderId: number;

    @ManyToOne(() => Driver, (driver) => driver.scheduledOrders)
    @JoinColumn({ name: 'driverId' })
    driver: Driver;

    @RelationId((scheduledOrder: ScheduledOrder) => scheduledOrder.driver)
    driverId: number;

    @ManyToOne(() => Truck, (truck) => truck.scheduledOrders)
    @JoinColumn({ name: 'truckId' })
    truck: Truck;

    @RelationId((scheduledOrder: ScheduledOrder) => scheduledOrder.truck)
    truckId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
