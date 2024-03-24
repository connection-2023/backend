import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document, Model, model } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class ChatRoom extends Document {
  @Prop({
    required: true,
    type: {
      id: { type: Number },
      participation: { type: Boolean, default: true },
    },
  })
  @IsNotEmpty()
  user: { id: number; participation: boolean };

  @Prop({
    required: true,
    type: {
      id: { type: Number },
      participation: { type: Boolean, default: true },
    },
  })
  @IsNotEmpty()
  lecturer: { id: number; participation: boolean };

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
ChatRoomSchema.index({ 'user.id': 1, 'lecturer.id': 1 }, { unique: true });
