import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
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

  @Prop({ required: false })
  @IsNumber()
  lecturerId?: number;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  url: string;

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
