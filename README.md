# FitJourney

A full-stack fitness and wellness app for building sustainable habits. Track workouts, daily hydration, nutrition targets, and personal progress in one place.

## Features

- Personalized dashboard with weekly activity and daily goals
- Workout library with search, filters, and completion tracking
- Nutrition target calculator and hydration logging
- Progress journal for weight, measurements, sleep, and notes
- Articles, account settings, and responsive navigation
- Admin tools for users, workouts, articles, and progress review
- Optional Indonesian translations for admin-managed article and workout content

## Tech stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Validation and security:** Zod, bcrypt, HTTP-only sessions, Helmet

## Run locally

Requirements: Node.js 22.19+ and MongoDB 8.

Install each app in its own folder so its dependencies stay local:

```bash
cd be
npm ci
cd ../fe
npm ci
cd ..
```

Create the backend environment file and seed sample content:

```bash
cp be/.env.example be/.env
cd be
npm run seed
cd ..
```

Start the API in one terminal:

```bash
cd be
npm run dev
```

Start the frontend in another terminal:

```bash
cd fe
npm run dev
```

On Windows PowerShell, create the environment file with `Copy-Item be/.env.example be/.env`. Open `http://localhost:5000`, create an account, and follow the onboarding steps. The frontend runs on port 5000 and proxies API requests to Express on port 4000.

### Optional admin account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `be/.env` before running the seed command. Use a password of at least 12 characters. The seed only creates the admin if the email does not already exist.

## Useful commands

| Command | Description |
| --- | --- |
| `cd fe && npm run dev` | Start the frontend |
| `cd fe && npm run build` | Type-check and build the frontend |
| `cd fe && npm run lint` | Lint frontend source files |
| `cd be && npm test` | Run API tests (requires local MongoDB) |
| `cd be && npm run seed` | Add sample workouts and articles |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the project structure and [desain.md](desain.md) for the detailed design specification.

## Notes

- Nutrition results are general estimates for adults, not medical advice.
- Sample content includes external images and video links; verify these before presenting them as official training programs.
- Profile and progress photos currently use HTTPS URLs; direct file uploads are not implemented.
- Email-based password reset requires SMTP configuration. Automated newsletter and reminder delivery are not included.

