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

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ required: false })
  @IsNumber()
  lectureId?: number;

  @Prop({ required: false })
  @IsNumber()
  couponId?: number;

  @Prop({ required: false })
  @IsNumber()
  lecturePassId?: number;

  @Prop({ required: false })
  @IsNumber()
  userPassId?: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
