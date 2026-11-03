import { Article } from '../models/index.js';
import { fail } from '../utils/AppError.js';

export const listArticles = async (req, res) =>
  res.json(await Article.find({ status: 'published' }).sort({ createdAt: -1 }).limit(200));

export const getArticle = async (req, res) => {
  const item = await Article.findOne({ slug: req.params.slug, status: 'published' });
  if (!item) throw fail(404, 'Article not found.');
  res.json(item);
};
