import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    gender: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fatherName: string;

    @Column(/*{ unique: true }*/)
    email: string;

    @Column()
    birthdate: Date;

    @OneToOne(() => User/*, {eager: false }*/)
    @JoinColumn({name : 'userId'})
    user: User;

    @RelationId((employee: Employee) => employee.user)
    userId: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
