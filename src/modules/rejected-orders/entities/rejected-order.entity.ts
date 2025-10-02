import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { RejectReason } from "./reject-reason.entity";



@Entity()
export class RejectedOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.rejectedOrders)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @RelationId((rejectedOrder: RejectedOrder) => rejectedOrder.order)
    orderId: number;

    @ManyToOne(() => Driver, (driver) => driver.rejectedOrders)
    @JoinColumn({ name: 'driverId' })
    driver: Driver;

    @RelationId((rejectedOrder: RejectedOrder) => rejectedOrder.driver)
    driverId: number;

    @ManyToOne(() => RejectReason, (rejectReason) => rejectReason.rejectedOrders)
    @JoinColumn({ name: 'rejectReasonId' })
    rejectReason: RejectReason;

    @RelationId((rejectedOrder: RejectedOrder) => rejectedOrder.rejectReason)
    rejectReasonId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
