import { Customer } from "src/modules/customers/entities/customer.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    city: string;

    @Column()
    area: string;

    @Column()
    street: string;

    @Column()
    floor: number;

    @Column()
    name: string;

    @Column({default: ''/*, type: 'text' */})
    details: string;
    
    @Column({default: 1})
    isActive: number;

    @Column({ type: 'double'/*, nullable: false */})
    latitude: number;

    @Column({ type: 'double'/*, nullable: false */})
    longitude: number;

    @Column({ nullable: false })
    googlePlaceId: string;

    @ManyToOne(() => Customer, (customer) => customer.addresses)
    @JoinColumn({ name: 'customerId' }) 
    customer: Customer;

    @RelationId((address: Address) => address.customer)
    customerId: number;

    @OneToMany(() => Order, (order) => order.fromAddress)
    fromOrders: Order[];

    @OneToMany(() => Order, (order) => order.toAddress)
    toOrders: Order[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
