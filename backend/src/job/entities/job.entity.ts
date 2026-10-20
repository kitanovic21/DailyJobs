import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../user/entities/user.entity.js'
import { Application } from "../../application/entities/application.entity.js";

export enum JobStatus{
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity('jobs')
@Index(['city'])
@Index(['pay'])
@Index(['startDate'])
export class Job {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    title : string;

    @Column('text')
    description : string;

    @Column()
    city: string;

    @Column({nullable : true})
    adress : string;

    //EUR
    @Column('int')
    pay : number;

    @Column({type : 'date'})
    startDate : Date;

    @Column({type : 'date',nullable : true})
    endDate? : Date;

    @Column({ type: 'enum', enum: JobStatus, default: JobStatus.OPEN })
    status: JobStatus;

    @Column({ default: false })
    isPremium: boolean;

    @Column({ type: 'int', default: 1 })
    workersNeeded: number;

    @ManyToOne(() => User, (user) => user.jobs, {nullable:false, onDelete: 'CASCADE'})
    employer: User;

    @OneToMany(() => Application, (app) => app.job)
    applications: Application[];

    @CreateDateColumn()
    createdAt : Date;

    @CreateDateColumn()
    updatedAt : Date;

    
}
