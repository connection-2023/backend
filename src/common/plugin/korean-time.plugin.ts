import { Schema, SchemaOptions } from 'mongoose';
import { generateCurrentTime } from '../utils/generate-current-time';

export const koreanTimePlugin = (schema: Schema, options: SchemaOptions) => {
  console.log(1);

  schema.pre('save', function (next) {
    const now = generateCurrentTime();
    this.createdAt = now;
    this.updatedAt = now;
    next();
  });

  schema.pre('updateOne', function (next) {
    const now = generateCurrentTime();
    this.set({ updatedAt: now });
    next();
  });
};
