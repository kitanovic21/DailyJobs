import { Module } from '@nestjs/common';
import { JobService } from './job.service.js';
import { JobController } from './job.controller.js';

@Module({
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
