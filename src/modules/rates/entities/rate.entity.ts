import { ClosedOrder } from "src/modules/closed-orders/entities/closed-order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";



@Entity()
export class Rate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value:number

    @Column({nullable: true, default: ''})//maybe in the future will make it unnullable
    note:string

    @OneToOne(() => ClosedOrder, (closedOrder) => closedOrder.rate)
    @JoinColumn({ name: 'closedOrderId' })
    closedOrder: ClosedOrder;

    @RelationId((rate: Rate) => rate.closedOrder)
    closedOrderId: number;    

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
