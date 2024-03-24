import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import { ApiParam } from '@nestjs/swagger';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<any, mongoose.Types.ObjectId>
{
  public transform(value: any): mongoose.Types.ObjectId {
    try {
      const transformedObjectId = new mongoose.Types.ObjectId(value);
      return transformedObjectId;
    } catch (error) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
  }
}
