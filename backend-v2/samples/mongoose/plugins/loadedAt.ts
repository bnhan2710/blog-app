import { Schema, Document } from 'mongoose';

const loadedAt = function (schema: Schema, options: any) {
  schema.virtual('loadedAt')
    .get(function (this: Document & { _loadedAt?: Date }) {
      return this._loadedAt;
    })
    .set(function (this: Document & { _loadedAt?: Date }, v: Date) {
      this._loadedAt = v;
    });

  schema.post(['find', 'findOne'], function(docs: any) {
    if (!Array.isArray(docs)) {
      docs = [docs];
    }
    const now = new Date();
    for (const doc of docs) {
      doc.loadedAt = now;
    }
  });
}


export default loadedAt