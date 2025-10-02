import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Item } from "src/modules/items/entities/item.entity";



@Entity()
export class CategoryType {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column(/*{ unique: true }*/)
    name_en: string;

    @Column(/*{ unique: true }*/)
    name_ar: string;

    @ManyToOne(() => Category, (category) => category.categoryTypes)
    @JoinColumn({ name: 'categoryId' }) 
    category: Category;

    @RelationId((categoryType: CategoryType) => categoryType.category)
    categoryId: number;

    @OneToMany(() => Item, (item) => item.categoryType)
    items: Item[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
