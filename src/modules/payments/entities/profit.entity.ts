import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profit{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'double' })
    CompanyProfitPercentage:number
}