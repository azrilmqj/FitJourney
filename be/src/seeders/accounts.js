import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { Session, User } from '../models/index.js';
import { credentialPassword, email } from '../validators/common.js';

if (env.production) throw new Error('Development account seed cannot run in production.');

const accounts = [
  {
    name: 'FitJourney Admin',
    email: email.parse(process.env.SEED_ADMIN_EMAIL),
    password: credentialPassword.parse(process.env.SEED_ADMIN_PASSWORD),
    role: 'admin',
  },
  {
    name: 'Azril Miqraji',
    email: email.parse(process.env.SEED_USER_EMAIL),
    password: credentialPassword.parse(process.env.SEED_USER_PASSWORD),
    role: 'user',
  },
];

if (accounts[0].email === accounts[1].email) {
  throw new Error('Admin and user seed emails must be different.');
}

await connectDatabase();
try {
  await User.init();
  for (const account of accounts) {
    const password = await bcrypt.hash(account.password, 12);
    const user = await User.findOneAndUpdate(
      { email: account.email },
      {
        $set: { password, role: account.role },
        $setOnInsert: { name: account.name, onboarded: account.role === 'admin' },
      },
      { upsert: true, new: true, runValidators: true },
    );
    await Session.deleteMany({ user: user._id });
    const saved = await User.findById(user._id).select('+password');
    if (saved.role !== account.role || !(await bcrypt.compare(account.password, saved.password))) {
      throw new Error(`Failed to verify seed account: ${account.email}`);
    }
    console.log(`Seed account ready: ${account.email} (${account.role})`);
  }
} finally {
  await disconnectDatabase();
}
