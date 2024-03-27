import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService],
})
export class BatchModule {}
