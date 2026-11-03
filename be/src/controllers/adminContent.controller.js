import { Article, Workout } from '../models/index.js';
import { fail } from '../utils/AppError.js';

function createContentController(Model) {
  return {
    list: async (req, res) => res.json(await Model.find().sort({ createdAt: -1 }).limit(500)),
    get: async (req, res) => {
      const item = await Model.findById(req.params.id);
      if (!item) throw fail(404, 'Content not found.');
      res.json(item);
    },
    create: async (req, res) => res.status(201).json(await Model.create(req.validated)),
    update: async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.validated, {
        new: true,
        runValidators: true,
      });
      if (!item) throw fail(404, 'Content not found.');
      res.json(item);
    },
    remove: async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw fail(404, 'Content not found.');
      res.json({ message: 'Content deleted.' });
    },
  };
}

export const workoutContent = createContentController(Workout);
export const articleContent = createContentController(Article);
