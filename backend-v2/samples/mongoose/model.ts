import mongoose from 'mongoose';
import loadedAt from './plugins/loadedAt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;
