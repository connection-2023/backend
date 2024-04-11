import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Notification extends Document {
  @Prop({
    required: true,
    type: {
      userId: { type: Number, default: null },
      lecturerId: { type: Number, default: null },
    },
  })
  @IsNotEmpty()
  target: { userId: number | null; lecturerId: number | null };

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ required: false, type: Number })
  @IsNumber()
  lectureId?: number;

  @Prop({ required: false, type: Number })
  @IsNumber()
  reservationId: number;

  @Prop({ required: false, type: Number })
  @IsNumber()
  couponId?: number;

  @Prop({ required: false, type: Number })
  @IsNumber()
  userPassId?: number;

  @Prop({ type: Date, default: null })
  readedAt: Date | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
