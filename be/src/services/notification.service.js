import { Article, User, Workout } from '../models/index.js';

export async function listNotifications(user) {
  const items = [];
  if (user.role === 'admin') {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [users, articles, workouts] = await Promise.all([
      User.find({ createdAt: { $gte: since }, _id: { $ne: user._id } })
        .select('name createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Article.find({ status: 'draft' })
        .select('title updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      Workout.find({ status: 'draft' })
        .select('title updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
    ]);
    for (const entry of users)
      items.push({
        id: `user-${entry._id}`,
        title: 'New member: {{name}}',
        params: { name: entry.name },
        createdAt: entry.createdAt,
        href: '/admin/users',
        kind: 'user',
      });
    for (const [entries, kind, href] of [
      [articles, 'article', '/admin/articles'],
      [workouts, 'workout', '/admin/videos'],
    ]) {
      for (const entry of entries)
        items.push({
          id: `${kind}-${entry._id}`,
          title: 'Draft ready to review: {{name}}',
          params: { name: entry.title },
          createdAt: entry.updatedAt,
          href,
          kind,
        });
    }
  } else {
    const [articles, workouts] = await Promise.all([
      Article.find({ status: 'published', createdAt: { $gte: user.createdAt } })
        .select('title slug createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Workout.find({ status: 'published', createdAt: { $gte: user.createdAt } })
        .select('title createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);
    items.push({
      id: `welcome-${user.id}`,
      title: 'Welcome to FitJourney',
      params: {},
      createdAt: user.createdAt,
      href: user.onboarded ? '/dashboard' : '/onboarding',
      kind: 'user',
    });
    for (const entry of articles)
      items.push({
        id: `article-${entry._id}`,
        title: 'New article: {{name}}',
        params: { name: entry.title },
        createdAt: entry.createdAt,
        href: `/articles/${entry.slug}`,
        kind: 'article',
      });
    for (const entry of workouts)
      items.push({
        id: `workout-${entry._id}`,
        title: 'New workout: {{name}}',
        params: { name: entry.title },
        createdAt: entry.createdAt,
        href: `/workouts/${entry._id}`,
        kind: 'workout',
      });
  }
  const readAt = user.notificationsReadAt?.getTime() || 0;
  const notifications = items
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => ({ ...item, read: item.createdAt.getTime() <= readAt }));
  return { notifications, unreadCount: notifications.filter((item) => !item.read).length };
}
