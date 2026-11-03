import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Article, User, Workout } from '../models/index.js';
import { articles, workouts } from './demo.data.js';
import { email, password } from '../validators/common.js';
await connectDatabase();
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

for (const [title, category, level, duration, trainer, target, image, videoId] of workouts)
  await Workout.updateOne(
    { title },
    {
      $setOnInsert: {
        title,
        category,
        level,
        duration,
        trainer,
        target,
        image: photo(image),
        videoId,
        exercises: [
          'Warm up at your own pace',
          'Follow the guided session',
          'Take breaks as needed',
          'Finish with a gentle cool down',
        ],
        description:
          'Make time to move with this guided session. Work at a pace that feels comfortable, take breaks when needed, and focus on controlled movement.',
        status: 'published',
      },
    },
    { upsert: true },
  );

for (const [title, category, image, excerpt, content] of articles) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '');
  await Article.updateOne(
    { slug },
    {
      $setOnInsert: {
        title,
        slug,
        category,
        image: photo(image),
        excerpt,
        content,
        author: 'FitJourney Editorial',
        readTime: 2,
        status: 'published',
      },
    },
    { upsert: true },
  );
}
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const adminEmail = email.parse(process.env.ADMIN_EMAIL);
  const adminPassword = password.parse(process.env.ADMIN_PASSWORD);
  await User.updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        name: 'FitJourney Admin',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'admin',
        onboarded: true,
      },
    },
    { upsert: true },
  );
}
console.log('Seed complete. Existing records were preserved.');
await disconnectDatabase();
