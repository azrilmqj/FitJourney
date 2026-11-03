import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
await connectDatabase();
const server = app.listen(env.port, () => console.log('FitJourney API running on port ' + env.port));
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  });
