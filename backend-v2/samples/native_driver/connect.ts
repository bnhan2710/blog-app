import { MongoClient, Db } from 'mongodb';

export default async function connect({
  url,
  dbName,
}: {
  url: string;
  dbName: string;
}): Promise<Db> {
  const client = new MongoClient(url);
  const db = client.db(dbName);

  await db.command({ ping: 1 });
  console.log('Database connected');

  return db;
}