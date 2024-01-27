import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document, Model, model } from 'mongoose';

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

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ required: true, type: Date, default: null })
  lastChatTime: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
ChatRoomSchema.index({ userId: 1, lecturerId: 1 }, { unique: true });
