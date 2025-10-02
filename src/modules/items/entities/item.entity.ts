import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";
import { ItemSize } from "./item-size.entity";
import { ItemWeight } from "./item-weight.entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { CategoryType } from "src/modules/categories/entities/category-type.entity";



@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    number: number;

    @Column()
    fragility: number;

    @Column()
    abilityToDisassemble: number;

    @ManyToOne(() => ItemSize, (itemSize) => itemSize.items)
    @JoinColumn({ name: 'itemSizeId' }) 
    itemSize: ItemSize;

    @RelationId((item: Item) => item.itemSize)
    itemSizeId: number;

    @ManyToOne(() => ItemWeight, (itemWeight) => itemWeight.items)
    @JoinColumn({ name: 'itemWeightId' }) 
    itemWeight: ItemWeight;

    @RelationId((item: Item) => item.itemWeight)
    itemWeightId: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'orderId' }) 
    order: Order;

    @RelationId((item: Item) => item.order)
    orderId: number;

    @ManyToOne(() => CategoryType, (categoryType) => categoryType.items)
    @JoinColumn({ name: 'categoryTypeId' }) 
    categoryType: CategoryType;

    @RelationId((item: Item) => item.categoryType)
    categoryTypeId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
