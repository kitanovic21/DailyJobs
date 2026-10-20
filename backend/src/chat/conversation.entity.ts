import {
  CreateDateColumn, Entity, Index, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { Job } from '../job/entities/job.entity.js'
import { User } from '../user/entities/user.entity.js'
import { Message } from './message.entity.js'

@Entity('conversations')
@Unique(['job', 'candidate'])
@Index(['employer'])
@Index(['candidate'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Job, { nullable: false, onDelete: 'CASCADE' })
  job: Job;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  employer: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  candidate: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}