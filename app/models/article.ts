import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://nebula:nebula_pass@localhost:27017/nebula?authSource=admin';
const dbName = 'nebula';

export async function getArticleContent(mongoId: string): Promise<string | null> {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('article_contents');
    
    const result = await collection.findOne({ _id: new ObjectId(mongoId) });
    return result?.content || null;
  } catch (error) {
    console.error('Error fetching article content:', error);
    return null;
  } finally {
    await client.close();
  }
}

export async function createArticleContent(content: string): Promise<string | null> {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('article_contents');
    
    const result = await collection.insertOne({
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error creating article content:', error);
    return null;
  } finally {
    await client.close();
  }
} 