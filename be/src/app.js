import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { verifyOrigin } from './middleware/origin.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import apiRoutes from './routes/index.js';

export const app = express();
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", 'https:', 'data:'],
        frameSrc: ['https://www.youtube-nocookie.com'],
        upgradeInsecureRequests: env.production ? [] : null,
      },
    },
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use('/api', apiLimiter, verifyOrigin, apiRoutes, notFound);

const clientDist = fileURLToPath(new URL('../../fe/dist/', import.meta.url));
if (env.production && existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false }));
  app.get('/{*path}', (req, res) => res.sendFile('index.html', { root: clientDist }));
}
app.use(errorHandler);
