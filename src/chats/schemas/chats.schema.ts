import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsObject } from 'class-validator';
import mongoose, { Document, ObjectId, now } from 'mongoose';

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
    type: {
      userId: { type: Number, default: null },
      lecturerId: { type: Number, default: null },
    },
  })
  @IsNotEmpty()
  sender: object;

  @Prop({
    required: true,
    type: {
      userId: { type: Number, default: null },
      lecturerId: { type: Number, default: null },
    },
  })
  @IsNotEmpty()
  receiver: object;

  @Prop({ required: true })
  @IsNotEmpty()
  content: string;

  @Prop({ required: false, default: null })
  @IsNotEmpty()
  isRead: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
