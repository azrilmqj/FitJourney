import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export const Article = model(
  'Article',
  new Schema(
    {
      title: String,
      slug: { type: String, unique: true },
      excerpt: String,
      content: String,
      category: String,
      image: String,
      author: String,
      readTime: Number,
      status: { type: String, default: 'published' },
    },
    { timestamps: true },
  ),
);
