import mongoose, { Schema, models, model } from 'mongoose';

const ArticleBodySchema = new Schema({
  articleId: { type: String, required: true, unique: true }, // RDBのArticle.idと紐付け
  body: { type: String, required: true }, // マークダウン本文
}, { timestamps: true });

export const ArticleBody = models.ArticleBody || model('ArticleBody', ArticleBodySchema); 