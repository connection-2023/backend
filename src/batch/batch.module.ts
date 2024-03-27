import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { TasksService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class BatchModule {}
