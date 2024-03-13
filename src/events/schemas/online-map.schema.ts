import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class OnlineMap extends Document {
  @Prop()
  @IsOptional()
  userId?: number;

  @Prop()
  @IsOptional()
  lecturerId?: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @Prop()
  @IsDate()
  lastLogin: Date | null;
}

export const OnlineMapSchema = SchemaFactory.createForClass(OnlineMap);
