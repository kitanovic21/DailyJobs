import {
  Column, CreateDateColumn, Entity, Index, ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity.js';
import { User } from '../user/entities/user.entity.js'

@Entity('messages')
@Index(['conversation', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  @ManyToOne(() => Conversation, (c) => c.messages, { nullable: false, onDelete: 'CASCADE' })
  conversation: Conversation;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}