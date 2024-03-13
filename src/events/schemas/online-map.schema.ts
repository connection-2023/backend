import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

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

  @Prop({ default: null })
  lastLogin: Date | null;
}

export const OnlineMapSchema = SchemaFactory.createForClass(OnlineMap);
