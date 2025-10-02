import { Address } from "src/modules/addresses/entities/address.entity";
import { ClosedOrder } from "src/modules/closed-orders/entities/closed-order.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Item } from "src/modules/items/entities/item.entity";
import { PaymentType } from "src/modules/payments/entities/payment-type.entity";
import { ProcessingOrder } from "src/modules/processing-orders/entities/processing-order.entity";
import { RejectedOrder } from "src/modules/rejected-orders/entities/rejected-order.entity";
import { SizeType } from "src/modules/truck-models/entities/size-type.entity";
import { VehicleType } from "src/modules/truck-models/entities/vehicle-type.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";
import { Photo } from "./photo.entity";
import { PendingOrder } from "../../pending-orders/entities/pending-order.entity";
import { ScheduledOrder } from "src/modules/scheduled-orders/entities/scheduled-order.entity";



@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    orderDateTime: Date;

    @Column({nullable: true})
    fromPhoneNumber: string;

    @Column({nullable: true})
    toPhoneNumber: string;

    @Column({nullable: true})
    isScheduled: number;

    @Column({nullable: true})
    fromHaveLift: number;
    
    @Column({nullable: true})
    toHaveLift: number;

    @Column({nullable: true})
    needHolders: number;

    @Column({nullable: true})
    fromFloorNumber: number;
    
    @Column({nullable: true})
    toFloorNumber: number;

    @Column()
    state: string;

    @Column({nullable: true, default: ''})
    note: string;

    @OneToMany(() => Item, (item) => item.order)
    items: Item[];

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: 'customerId' }) 
    customer: Customer;

    @RelationId((order: Order) => order.customer)
    customerId: number;

    @ManyToOne(() => Address, (address) => address.fromOrders)
    @JoinColumn({ name: 'fromAddressId' })
    fromAddress: Address;

    @RelationId((order: Order) => order.fromAddress)
    fromAddressId: number;

    @ManyToOne(() => Address, (address) => address.toOrders)
    @JoinColumn({ name: 'toAddressId' })
    toAddress: Address;

    @RelationId((order: Order) => order.toAddress)
    toAddressId: number;

    @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.orders)
    @JoinColumn({ name: 'vehicleTypeId' }) 
    vehicleType: VehicleType;

    @RelationId((order: Order) => order.vehicleType)
    vehicleTypeId: number;

    @ManyToOne(() => SizeType, (sizeType) => sizeType.orders)
    @JoinColumn({ name: 'sizeTypeId' }) 
    sizeType: SizeType;

    @RelationId((order: Order) => order.sizeType)
    sizeTypeId: number;

    @ManyToOne(() => PaymentType, (paymentType) => paymentType.orders)
    @JoinColumn({ name: 'paymentTypeId' }) 
    paymentType: PaymentType;

    @RelationId((order: Order) => order.paymentType)
    paymentTypeId: number;

    @OneToMany(() => PendingOrder, (pendingOrder) => pendingOrder.order)
    pendingOrders: PendingOrder[];

    @OneToMany(() => ProcessingOrder, (processingOrder) => processingOrder.order)
    processingOrders: ProcessingOrder[];

    @OneToMany(() => ClosedOrder, (closedOrder) => closedOrder.order)
    closedOrders: ClosedOrder[];    

    @OneToMany(() => RejectedOrder, (rejectedOrder) => rejectedOrder.order)
    rejectedOrders: RejectedOrder[];

    @OneToMany(() => ScheduledOrder, (scheduledOrder) => scheduledOrder.order)
    scheduledOrders: ScheduledOrder[];

    @OneToMany(() => Photo, (photo) => photo.order)
    photos: Photo[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
