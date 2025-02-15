import mongoose from 'mongoose';
import loadedAt from './plugins/loadedAt';
import bcrypt from 'bcrypt'
import { timestampPlugin } from './plugins/timestamp';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type : Date , require: false },
});


userSchema.plugin(timestampPlugin);
userSchema.pre('save', async function(this, next, option){
  // userSchema.plugin()
  next()
});

userSchema.post('save', function(this, result, next){
  console.log(this)
  next()
})

userSchema.pre('findOne', function(this, next){

})

const User = mongoose.model('User', userSchema);

export default User;
