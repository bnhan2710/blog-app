import { Schema, Document } from 'mongoose';

export function timestampPlugin(schema: Schema, options: any) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
  });

  schema.pre('save', function (this: Document, next) {
    if (this.isNew) {
      this.set('createdAt', Date.now());
    }
    next();
  });
}