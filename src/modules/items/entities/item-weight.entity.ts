import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";
import { Item } from "./item.entity";



@Entity()
export class ItemWeight {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column(/*{ unique: true }*/)
    name_en: string;

    @Column(/*{ unique: true }*/)
    name_ar: string;

    @OneToMany(() => Item, (item) => item.itemWeight)
    items: Item[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
