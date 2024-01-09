import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsObject } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'ChattingRoom',
  })
  @IsNotEmpty()
  chattingRommId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  @IsNotEmpty()
  sender: {
    lecturerId: { type: number; default: null };
    userId: { type: number; default: null };
  };

  @Prop({ required: true })
  @IsNotEmpty()
  receiver: {
    lecturerId: { type: number; default: null };
    userId: { type: number; default: null };
  };

  @Prop({ required: true })
  @IsNotEmpty()
  content: string;

  @Prop({ required: true })
  @IsNotEmpty()
  isRead: boolean;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
