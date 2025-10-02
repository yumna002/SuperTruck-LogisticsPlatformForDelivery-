import { Driver } from "src/modules/drivers/entities/driver.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Order } from "../../orders/entities/order.entity";



@Entity()
export class PendingOrder{
    @PrimaryGeneratedColumn()
    id: number;    

    @ManyToOne(() => Order, (order) => order.pendingOrders)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @RelationId((pendingOrder: PendingOrder) => pendingOrder.order)
    orderId: number;

    @ManyToOne(() => Driver, (driver) => driver.pendingOrders,{ nullable: true })
    @JoinColumn({ name: 'driverId' })
    driver: Driver|null;

    @RelationId((pendingOrder: PendingOrder) => pendingOrder.driver)
    driverId: number|null;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
