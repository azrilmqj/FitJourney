const production = process.env.NODE_ENV === 'production';
const appOrigin = process.env.APP_ORIGIN || 'http://localhost:5000';

export const env = Object.freeze({
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitjourney',
  appOrigin,
  allowedOrigins: Object.freeze([
    appOrigin,
    ...(!production
      ? (process.env.DEV_APP_ORIGINS ?? 'http://localhost:5001')
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      : []),
  ]),
  production,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },
});
