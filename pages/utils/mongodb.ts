// Backend: mongodb.ts
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let dbConnection: Db | null = null;

const connectToDatabase = async (): Promise<Db> => {
  if (!dbConnection) {
    await client.connect();
    dbConnection = client.db('dynamic-minsta');
    console.log("Connected to MongoDB");
  }
  return dbConnection;
};

export default connectToDatabase;
