import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class ChatRoom extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsNumber()
  lecturerId: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  rommId: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
