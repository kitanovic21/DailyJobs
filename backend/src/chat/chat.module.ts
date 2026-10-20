import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity.js';
import { Message } from './message.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation, Message])]

})
export class ChatModule {}
