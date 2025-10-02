import { Column, Double, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Pricing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    firstFloorPrice: number;

    @Column({ type: 'double' })
    highestValueSmallWeight: number;

    @Column({ type: 'double' })
    highestValueMediumWeight: number;

    @Column({ type: 'double' })
    increaseRateMediumWeight: number;

    @Column({ type: 'double' })
    increaseRateHeavyWeight: number;

    @Column({ type: 'double' })
    netProfit: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
