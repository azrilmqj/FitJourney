import { Router } from 'express';
import * as controller from '../controllers/article.controller.js';
const router = Router();
router.get('/', controller.listArticles);
router.get('/:slug', controller.getArticle);
export default router;
