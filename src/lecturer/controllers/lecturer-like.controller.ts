import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { LecturerLikeService } from '../services/lecturer-like.service';

@Controller('lecturer-like')
export class LecturerLikeController {
  constructor(private readonly lecturerLikeService:LecturerLikeService){}
  
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Post()
}
