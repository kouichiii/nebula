import { NextRequest } from 'next/server';
import { dbConnect } from '../../../utils/mongodb';
import { ArticleBody } from '../../../models/ArticleBody';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const doc = await ArticleBody.findOne({ articleId: params.id });
  if (!doc) {
    return new Response(JSON.stringify({ body: '' }), { status: 200 });
  }
  return new Response(JSON.stringify({ body: doc.body }), { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { body } = await req.json();
  const updated = await ArticleBody.findOneAndUpdate(
    { articleId: params.id },
    { body },
    { upsert: true, new: true }
  );
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 