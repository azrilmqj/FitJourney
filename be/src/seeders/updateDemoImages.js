import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Article, Workout } from '../models/index.js';
import { articles, workouts } from './demo.data.js';

// One-time migration: replace only original demo images, preserving custom content.
const oldIds = [
  'photo-1566241142559-40e1dab266c6',
  'photo-1434596922112-19c563067271',
  'photo-1506126613408-eca07ce68773',
  'photo-1538805060514-97d9cc17730c',
  'photo-1518611012118-696072aa579a',
  'photo-1541781774459-bb2af2f05b55',
  'photo-1476480862126-209bfaa8edc8',
];
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;
await connectDatabase();
try {
  let updated = 0;
  for (const [Model, rows, imageIndex] of [
    [Workout, workouts, 6],
    [Article, articles, 2],
  ]) {
    for (const row of rows) {
      const result = await Model.updateOne(
        { title: row[0], image: { $in: oldIds.map(photo) } },
        { $set: { image: photo(row[imageIndex]) } },
      );
      updated += result.modifiedCount;
    }
  }
  console.log(`Updated ${updated} original demo images. Custom images were preserved.`);
} finally {
  await disconnectDatabase();
}
