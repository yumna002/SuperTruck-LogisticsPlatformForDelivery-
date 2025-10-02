import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";
import { CategoryType } from "./category-type.entity";



@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column(/*{ unique: true }*/)
    name_en: string;

    @Column(/*{ unique: true }*/)
    name_ar: string;

    @OneToMany(() => CategoryType, (categoryType) => categoryType.category)
    categoryTypes: CategoryType[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
