import mongoose from 'mongoose';

export default async function connect({
  url,
}: {
  url: string
}) {
  await mongoose.connect(url);
  console.log('Database connected');
}