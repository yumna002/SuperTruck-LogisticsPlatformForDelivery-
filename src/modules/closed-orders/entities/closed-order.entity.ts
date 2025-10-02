import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Rate } from "src/modules/rates/entities/rate.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class ClosedOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    expectedPrice: number;

    @Column({ type: 'double' })
    finalPrice: number;

    @Column({ type: 'double' })
    finalDriverPrice: number;

    @Column({ type: 'double' })
    finalHolderPrice: number;

    @Column({ type: 'double' })
    finalDistance: number;  //in km

    @Column()
    finalTime: number;  //in seconds

    @Column({default : 0})
    isPaid:number;

    @ManyToOne(() => Order, (order) => order.closedOrders)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @RelationId((closedOrder: ClosedOrder) => closedOrder.order)
    orderId: number;

    @ManyToOne(() => Driver, (driver) => driver.closedOrders)
    @JoinColumn({ name: 'driverId' }) 
    driver: Driver;

    @RelationId((closedOrder: ClosedOrder) => closedOrder.driver)
    driverId: number;

    @OneToOne(() => Rate, (rate) => rate.closedOrder)
    rate: Rate;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
