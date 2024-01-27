import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import mongoose, { Document, model } from 'mongoose';
import { ChatRoom, ChatRoomSchema } from './chats-room.schema';
import { Model } from 'mongoose';

@Schema()
export class Chats extends Document {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'ChatRoom',
  })
  @IsNotEmpty()
  chattingRoomId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: {
      userId: { type: Number, default: null },
      lecturerId: { type: Number, default: null },
    },
  })
  @IsNotEmpty()
  sender: { userId: number | null; lecturerId: number | null };

  @Prop({
    required: true,
    type: {
      userId: { type: Number, default: null },
      lecturerId: { type: Number, default: null },
    },
  })
  @IsNotEmpty()
  receiver: { userId: number | null; lecturerId: number | null };

  @Prop({ required: true })
  @IsNotEmpty()
  content: string;

  @Prop({ required: false, default: null })
  @IsNotEmpty()
  readAt: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
