import { Address } from "src/modules/addresses/entities/address.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    birthdate: Date;
    
    @OneToMany(() => Address, (address) => address.customer)
    addresses: Address[];

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];

    @OneToOne(() => User/*, { eager: true }*/)
    @JoinColumn({name : 'userId'})
    user: User;

    @RelationId((customer: Customer) => customer.user)
    userId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
