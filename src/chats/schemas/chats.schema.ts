import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsObject } from 'class-validator';
import mongoose, { Document, ObjectId } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Chats extends Document {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'ChattingRoom',
  })
  @IsNotEmpty()
  chattingRommId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: { userId: { type: Number }, lecturerId: { type: Number } },
  })
  @IsNotEmpty()
  sender: object;

  @Prop({
    required: true,
    type: { userId: { type: Number }, lecturerId: { type: Number } },
  })
  @IsNotEmpty()
  receiver: object;

  @Prop({ required: true })
  @IsNotEmpty()
  content: string;

  @Prop({ required: true })
  @IsNotEmpty()
  isRead: boolean;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
