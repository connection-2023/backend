import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import mongoose, { Document, SchemaOptions } from 'mongoose';
import { ChatRoom, ChatRoomSchema } from './chats-room.schema';
import { Transform } from 'class-transformer';

export type ChatsDocument = Chats & Document;

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Chats {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: ChatRoom.name,
  })
  @Transform(({ value }) => value.toString())
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
  readedAt: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
