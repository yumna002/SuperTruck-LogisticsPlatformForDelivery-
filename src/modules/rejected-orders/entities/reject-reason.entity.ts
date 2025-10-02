import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RejectedOrder } from "./rejected-order.entity";



@Entity()
export class RejectReason{
    @PrimaryGeneratedColumn()
    id: number;

    @Column(/*{ unique: true }*/)
    name_en: string;

    @Column(/*{ unique: true }*/)
    name_ar: string;

    @OneToMany(() => RejectedOrder, (rejectedOrder) => rejectedOrder.rejectReason)
    rejectedOrders: RejectedOrder[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
