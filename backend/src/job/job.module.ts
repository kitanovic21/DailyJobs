import { Module } from '@nestjs/common';
import { JobService } from './job.service.js';
import { JobController } from './job.controller.js';
import { Job } from './entities/job.entity.js'
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
