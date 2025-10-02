import { Customer } from "src/modules/customers/entities/customer.entity";
import { Driver } from "src/modules/drivers/entities/driver.entity";
import { Employee } from "src/modules/employees/entities/employee.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ unique: true })
    phoneNumber: string;

    @Column({nullable: true, default: ''})
    password: string;
    
    @Column({ default: 1})
    isActive: number;

    @Column({ default: '#' })
    fcmToken: string;

    @Column({ default: '#' })
    refreshToken: string;

    @Column(/*{type:'enum', enum:UserTypeEnum}*/)
    userType: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @RelationId((user: User) => user.role)
    roleId: number;

    @OneToOne(()=>Customer,(customer)=>customer.user)
    customer:Customer

    @OneToOne(()=>Driver,(driver)=>driver.user)
    driver:Driver

    @OneToOne(()=>Employee,(employee)=>employee.user)
    employee:Employee

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updatedAt: Date;
}
