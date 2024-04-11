import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [ScheduleModule.forRoot(), CqrsModule],
  providers: [TasksService],
})
export class BatchModule {}
