import { Address } from "src/modules/addresses/entities/address.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Item } from "src/modules/items/entities/item.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { SizeType } from "src/modules/truck-models/entities/size-type.entity";
import { VehicleType } from "src/modules/truck-models/entities/vehicle-type.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class PaymentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(/*{ unique: true }*/)
    name_en: string;

    @Column(/*{ unique: true }*/)
    name_ar: string;
    @OneToMany(() => Order, (order) => order.paymentType)
    orders: Order[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
