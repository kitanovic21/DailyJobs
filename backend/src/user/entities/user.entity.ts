import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Job } from '../../job/entities/job.entity.js'
import { Application } from "../../application/entities/application.entity.js";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({unique: true})
    email : string;

    @Column({select : false})
    passwordHash: string;

    @Column()
    firstName : string;

    @Column()
    lastName : string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column()
    age : number;

    @Column({nullable : true})
    phone? : string;

    @OneToMany(() => Job, (job) => job.employer)
    jobs : Relation<Job[]>;

    @OneToMany(() => Application, (app) => app.applicant)
    applications: Relation<Application[]>;

    @CreateDateColumn()
    createdAt : Date;
}
