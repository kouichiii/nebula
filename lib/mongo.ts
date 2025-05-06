import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

const uri = process.env.MONGODB_URI;
let client: MongoClient;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}
