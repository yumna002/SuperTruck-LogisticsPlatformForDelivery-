import { Address } from "src/modules/addresses/entities/address.entity";
import { ClosedOrder } from "src/modules/closed-orders/entities/closed-order.entity";
import { PendingOrder } from "src/modules/pending-orders/entities/pending-order.entity";
import { ProcessingOrder } from "src/modules/processing-orders/entities/processing-order.entity";
import { RejectedOrder } from "src/modules/rejected-orders/entities/rejected-order.entity";
import { ScheduledOrder } from "src/modules/scheduled-orders/entities/scheduled-order.entity";
import { Truck } from "src/modules/trucks/entities/truck.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fatherName: string;

    @Column({ unique: true })
    nationalNumber: string;

    @Column(/*{type:'enum', enum:GenderEnum}*/)
    gender: string;

    @Column()
    birthdate: Date;

    @Column()
    address: string;

    @Column()
    city: string;
    
    @Column()
    rate:number
    
    @Column('double', { default: 0 })
    rateSum: number;
    
    @Column({default : 0})
    rateCount:number;

    @Column('double') 
    extraProfit: number;

    @Column({default: 0})
    isOnline: number;

    @Column({default: 0})
    isAvailable: number;

    @OneToOne(() => User)
    @JoinColumn({name : 'userId'})
    user: User;

    @RelationId((driver: Driver) => driver.user)
    userId: number;

    @OneToMany(() => Truck, truck => truck.driver)
    truck: Truck[];

    @OneToMany(() => PendingOrder, (pendingOrder) => pendingOrder.driver)
    pendingOrders: PendingOrder[];

    @OneToMany(() => ProcessingOrder, (processingOrder) => processingOrder.driver)
    processingOrders: ProcessingOrder[];

    @OneToMany(() => ClosedOrder, (closedOrder) => closedOrder.driver)
    closedOrders: ClosedOrder[];

    @OneToMany(() => RejectedOrder, (rejectedOrder) => rejectedOrder.driver)
    rejectedOrders: RejectedOrder[];

    @OneToMany(() => ScheduledOrder, (scheduledOrder) => scheduledOrder.driver)
    scheduledOrders: ScheduledOrder[];


    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
