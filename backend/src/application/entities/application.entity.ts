import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, type Relation } from "typeorm";
import { User } from '../../user/entities/user.entity.js'
import { Job } from '../../job/entities/job.entity.js'

export enum ApplicationStatus{
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',

}

@Entity('applications')
@Unique(['job','applicant'])
export class Application {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;
 
    @Column({ type: 'text', nullable: true })
    note?: string;

    @ManyToOne(() => Job, (job) => job.applications, { nullable: false, onDelete: 'CASCADE' })
    job: Relation<Job>;

    @ManyToOne(() => User, (user) => user.applications, { nullable: false, onDelete: 'CASCADE' })
    applicant: Relation<User>;
}
