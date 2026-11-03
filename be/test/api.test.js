import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app.js';
import { User, Workout, Progress, Session, Reset, Activity, Article } from '../src/models/index.js';
import { calculateNutrition } from '../src/services/nutrition.service.js';
const origin = 'http://localhost:5000';
const dbName = `miqora_test_${Date.now()}`;
before(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017', { dbName });
  await Promise.all([
    User.init(),
    Workout.init(),
    Progress.init(),
    Session.init(),
    Reset.init(),
    Activity.init(),
    Article.init(),
  ]);
});
after(async () => {
  if (mongoose.connection.name === dbName && dbName.startsWith('miqora_test_'))
    await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
const agent = () => request.agent(app);
test('notifications require authentication, isolate admin data, and persist read status', async () => {
  assert.equal((await request(app).get('/api/notifications')).status, 401);
  const member = agent();
  const admin = agent();
  const memberUser = await register(member, 'NoticeMember');
  const adminUser = await register(admin, 'NoticeAdmin');
  await User.updateOne({ _id: adminUser._id }, { role: 'admin' });
  const draft = await Article.create({
    title: 'Private draft',
    slug: 'private-notice-draft',
    status: 'draft',
  });
  const memberNotices = await member.get('/api/notifications');
  assert.equal(memberNotices.status, 200);
  assert.ok(memberNotices.body.notifications.every((item) => !item.href.startsWith('/admin')));
  assert.ok(!JSON.stringify(memberNotices.body).includes('Private draft'));
  const adminNotices = await admin.get('/api/notifications');
  assert.ok(adminNotices.body.notifications.some((item) => item.id === `article-${draft.id}`));
  assert.ok(adminNotices.body.unreadCount > 0);
  assert.equal((await admin.post('/api/notifications/read').set('Origin', origin)).status, 200);
  assert.equal((await admin.get('/api/notifications')).body.unreadCount, 0);
  assert.equal((await User.findById(memberUser._id)).notificationsReadAt, null);
  assert.ok((await member.get('/api/notifications')).body.unreadCount > 0);
});
async function register(client, name) {
  const res = await client
    .post('/api/auth/register')
    .set('Origin', origin)
    .send({ name, email: `${name.toLowerCase()}@example.com`, password: 'Long-password-123!' });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body;
}
test('nutrition calculation has known output and rejects invalid input', () => {
  const result = calculateNutrition({
    age: 28,
    gender: 'female',
    height: 165,
    weight: 60,
    activity: 1.55,
    goal: 'maintain',
  });
  assert.deepEqual(result, { calories: 2062, protein: 129, carbs: 232, fat: 69 });
  assert.throws(() => calculateNutrition({ age: -1 }));
});
test('authentication, profile whitelist, ownership, admin guard, session revocation', async () => {
  const alice = agent();
  const bob = agent();
  const a = await register(alice, 'Alice');
  await register(bob, 'Bob');
  assert.equal(a.password, undefined);
  assert.equal(a.role, 'user');
  assert.equal((await request(app).get('/api/me')).status, 401);
  assert.equal((await alice.get('/api/admin/users')).status, 403);
  assert.equal((await alice.patch('/api/me').send({ name: 'Attacker' })).status, 403);
  const profile = await alice
    .patch('/api/me')
    .set('Origin', origin)
    .send({ name: 'Alice Updated', profile: { age: 28, weight: 60 }, role: 'admin' });
  assert.equal(profile.status, 200, JSON.stringify(profile.body));
  assert.equal(profile.body.role, 'user');
  assert.equal(profile.body.profile.age, 28);
  const entry = await alice
    .post('/api/progress')
    .set('Origin', origin)
    .send({ date: new Date().toISOString().slice(0, 10), weight: 65 });
  assert.equal(entry.status, 201);
  assert.equal((await bob.get('/api/progress')).body.length, 0);
  assert.equal(
    (await bob.delete(`/api/progress/${entry.body._id}`).set('Origin', origin)).status,
    404,
  );
  assert.equal(
    (
      await alice
        .post('/api/progress')
        .set('Origin', origin)
        .send({ date: '2026-02-31', weight: -10 })
    ).status,
    400,
  );
  assert.equal(
    (await alice.post('/api/activity/water').set('Origin', origin).send({ water: 4 })).status,
    200,
  );
  const water = await alice.post('/api/activity/water').set('Origin', origin).send({ water: 5 });
  assert.equal(water.body.water, 5);
  assert.equal(await Activity.countDocuments({ user: a._id }), 1);
  const target = await alice
    .put('/api/nutrition/target')
    .set('Origin', origin)
    .send({ age: 28, gender: 'female', height: 165, weight: 60, activity: 1.55, goal: 'maintain' });
  assert.equal(target.status, 200);
  assert.equal((await alice.get('/api/me')).body.target.calories, 2062);
  assert.equal((await alice.post('/api/auth/logout').set('Origin', origin)).status, 200);
  assert.equal((await alice.get('/api/me')).status, 401);
  assert.equal(
    (
      await alice
        .post('/api/auth/login')
        .set('Origin', origin)
        .send({ email: 'alice@example.com', password: 'incorrect' })
    ).status,
    401,
  );
  assert.equal(
    (
      await alice
        .post('/api/auth/login')
        .set('Origin', origin)
        .send({ email: 'alice@example.com', password: 'Long-password-123!' })
    ).status,
    200,
  );
});
test('admin CRUD validates input, separates drafts, and restricts self-demotion', async () => {
  const admin = agent();
  const user = await register(admin, 'Admin');
  await User.updateOne({ _id: user._id }, { role: 'admin' });
  const draft = {
    title: 'Test workout',
    description: 'Guided movement.',
    category: 'Strength',
    level: 'Beginner',
    duration: 20,
    trainer: 'Trainer',
    target: 'Core',
    image: 'https://example.com/image.jpg',
    videoId: 'AnYl6Nk9GOA',
    exercises: ['Warm up'],
    status: 'draft',
  };
  const created = await admin.post('/api/admin/videos').set('Origin', origin).send(draft);
  assert.equal(created.status, 201);
  assert.equal((await request(app).get('/api/workouts')).body.length, 0);
  assert.equal(
    (
      await admin
        .put(`/api/admin/videos/${created.body._id}`)
        .set('Origin', origin)
        .send({ ...draft, status: 'published' })
    ).status,
    200,
  );
  assert.equal((await request(app).get('/api/workouts')).body.length, 1);
  assert.equal(
    (
      await admin
        .post('/api/activity/workout')
        .set('Origin', origin)
        .send({ workoutId: created.body._id })
    ).status,
    200,
  );
  assert.equal((await admin.get('/api/activity')).body[0].workouts[0].duration, 20);
  assert.equal(
    (await admin.patch(`/api/admin/users/${user._id}`).set('Origin', origin).send({ role: 'user' }))
      .status,
    400,
  );
  assert.equal(
    (await admin.delete(`/api/admin/videos/${created.body._id}`).set('Origin', origin)).status,
    200,
  );
  assert.equal((await request(app).get('/api/workouts/not-an-id')).status, 400);
  const bad = await admin
    .post('/api/admin/videos')
    .set('Origin', origin)
    .send({ ...draft, image: 'javascript:alert(1)' });
  assert.equal(bad.status, 400);
});
test('password changes invalidate other sessions; deleting account removes private data', async () => {
  const client = agent();
  const user = await register(client, 'DeleteMe');
  const second = agent();
  await second
    .post('/api/auth/login')
    .set('Origin', origin)
    .send({ email: user.email, password: 'Long-password-123!' });
  const changed = await client
    .post('/api/me/password')
    .set('Origin', origin)
    .send({ currentPassword: 'Long-password-123!', password: 'Another-password-123!' });
  assert.equal(changed.status, 200);
  assert.equal((await second.get('/api/me')).status, 401);
  assert.equal((await client.get('/api/me')).status, 200);
  await client
    .post('/api/progress')
    .set('Origin', origin)
    .send({ date: new Date().toISOString().slice(0, 10), weight: 70 });
  assert.equal(
    (
      await client
        .delete('/api/me')
        .set('Origin', origin)
        .send({ password: 'Another-password-123!' })
    ).status,
    200,
  );
  assert.equal(await Progress.countDocuments({ user: user._id }), 0);
  assert.equal(await Session.countDocuments({ user: user._id }), 0);
});
