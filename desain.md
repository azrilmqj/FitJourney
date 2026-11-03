# FitJourney — Design Specification

> **Tagline:** Move. Improve. Become.  
> **Product type:** Fitness & Health Web Application  
> **Stack target:** MERN — MongoDB, Express.js, React, Node.js  
> **Design direction:** Modern clean fitness dashboard with soft pastel accents, rounded cards, generous whitespace, and responsive layouts.

---

## 1. Product Vision

**FitJourney** adalah aplikasi fitness dan kesehatan yang membantu pengguna:

- menemukan panduan workout melalui video,
- menghitung kebutuhan nutrisi harian,
- melacak progress tubuh,
- membaca artikel kesehatan dan kebugaran,
- melihat ringkasan perkembangan melalui dashboard.

FitJourney tidak hanya ditujukan untuk pengguna gym berpengalaman. Desain dan fitur harus tetap nyaman digunakan oleh pemula, pengguna yang ingin hidup lebih sehat, pengguna yang sedang menurunkan berat badan, maupun pengguna yang ingin meningkatkan massa otot.

---

# 2. Brand Identity

## Brand Name

**FitJourney**

Nama digunakan sebagai identitas utama produk di:

- logo,
- navbar,
- sidebar,
- halaman login/register,
- favicon,
- metadata website,
- admin panel.

## Tagline

**Move. Improve. Become.**

Alternatif copy pendukung:

> A healthier you. A stronger tomorrow.

---

# 3. Design Direction

Referensi utama menggunakan karakter visual:

- light theme,
- layout bersih,
- sidebar minimal,
- card dengan sudut besar,
- background abu sangat terang,
- warna pastel sebagai accent,
- typography hitam/charcoal,
- whitespace luas,
- icon minimal,
- chart sederhana,
- foto workout sebagai visual utama,
- tampilan modern seperti SaaS dashboard.

### Feel yang ingin dicapai

- Modern
- Clean
- Premium
- Friendly
- Sporty
- Calm
- Professional
- Tidak terlalu “hardcore gym”

---

# 4. Color System

Gunakan warna secara konsisten berdasarkan fungsi.

## Base Colors

```css
:root {
  --background: #F3F4F4;
  --surface: #FFFFFF;

  --text-primary: #111111;
  --text-secondary: #6F7378;
  --text-muted: #9A9DA1;

  --border: #E7E8E8;
  --border-strong: #D8DADB;
}
```

## Accent Colors

```css
:root {
  --blue-soft: #BFE8F5;
  --blue-primary: #39A9D0;
  --blue-dark: #248AAA;

  --green-soft: #DDEFB8;
  --green-primary: #86B84C;
  --green-dark: #689838;

  --peach-soft: #F7BEA8;
  --peach-primary: #F08F6C;

  --purple-soft: #E9E0F8;

  --warning-soft: #FFE5AE;
  --warning: #F5A623;

  --danger-soft: #FFD9D9;
  --danger: #E64C4C;
}
```

## Semantic Usage

| Warna | Penggunaan |
|---|---|
| Blue | Workout, activity, primary interaction |
| Green | Progress, success, positive achievement |
| Peach | Nutrition, calories, energy |
| Purple | Secondary insight / sleep / analytics |
| Red | Error / destructive action |
| Gray | Neutral UI / disabled / secondary content |

---

# 5. Typography

## Primary Font

**Plus Jakarta Sans**

Fallback:

```css
font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
```

Alasan pemilihan:

- modern,
- readable,
- clean,
- cocok untuk dashboard,
- cocok untuk mobile,
- karakter rounded sesuai dengan UI FitJourney.

## Font Weights

```text
400 — Regular
500 — Medium
600 — SemiBold
700 — Bold
800 — ExtraBold
```

## Typography Scale

| Style | Size | Weight | Usage |
|---|---:|---:|---|
| Display | 48–64px | 700–800 | Landing hero |
| H1 | 32–40px | 700 | Main page title |
| H2 | 24–30px | 700 | Section title |
| H3 | 18–22px | 600–700 | Card title |
| Body Large | 16–18px | 400–500 | Hero/body |
| Body | 14–16px | 400 | Main content |
| Small | 12–13px | 400–500 | Metadata |
| Caption | 11–12px | 500 | Badge/helper text |

## General Typography Rules

- Hindari terlalu banyak font weight.
- Gunakan heading hitam pekat.
- Gunakan gray untuk supporting text.
- Jangan menggunakan ALL CAPS kecuali badge kecil.
- Line-height body minimal `1.5`.
- Heading boleh menggunakan line-height lebih rapat `1.1–1.25`.

---

# 6. Layout System

## Desktop

```text
Viewport target: 1280px+
Sidebar: 72–88px
Content padding: 28–40px
Card gap: 16–24px
```

Sidebar menggunakan **icon-first navigation**.

## Tablet

```text
Viewport: 768px–1279px
Sidebar dapat collapse
Grid utama: 2 columns
Card gap: 16px
```

## Mobile

```text
Viewport: < 768px
Sidebar dihilangkan
Bottom navigation digunakan
Content padding: 16px
Card stacking: 1 column
```

---

# 7. Border Radius

Gunakan rounded UI seperti referensi utama.

```css
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 20px;
--radius-xl: 26px;
--radius-pill: 999px;
```

Rekomendasi:

- Button: `12–14px`
- Input: `12–14px`
- Standard card: `18–22px`
- Hero card: `24–28px`
- Badge: pill

---

# 8. Shadows

Shadow harus halus.

```css
box-shadow:
  0 8px 30px rgba(15, 23, 42, 0.05);
```

Hover card:

```css
box-shadow:
  0 12px 36px rgba(15, 23, 42, 0.08);
```

Hindari shadow gelap atau terlalu tajam.

---

# 9. App Navigation

## Desktop Sidebar

Urutan:

```text
FitJourney Logo

Dashboard
Workout
Nutrition
Progress
Articles

----------------

Profile
Settings
Logout
```

### Icon Suggestions

Gunakan **Lucide React**.

```text
Dashboard  → House
Workout    → Dumbbell
Nutrition  → Utensils
Progress   → ChartNoAxesCombined
Articles   → FileText
Profile    → User
Settings   → Settings
Logout     → LogOut
```

## Active State

- background pastel blue,
- icon biru tua,
- sedikit rounded,
- tidak memakai garis tebal.

---

# 10. Top Navigation

Konten:

```text
Search
Notification
Avatar
Username
Dropdown
```

Search desktop berada di bagian atas.

Mobile:

```text
Logo / page title
Notification
Avatar
```

---

# 11. Landing Page

## Hero

Layout desktop:

```text
LEFT
- badge
- main heading
- description
- primary CTA
- secondary CTA
- quick statistics

RIGHT
- fitness image
- floating stat cards
```

### Suggested Copy

```text
Move Better.
Live Stronger.

Your all-in-one fitness companion for workout guidance,
nutrition planning, health education, and progress tracking.
```

Buttons:

```text
Get Started
Explore Workouts
```

## Sections

```text
Hero
Features
How FitJourney Works
Workout Preview
Nutrition Feature
Progress Tracking
Health Articles
CTA
Footer
```

---

# 12. Authentication Pages

## Login

Desktop layout:

```text
Form             Fitness Visual
```

Form:

```text
Welcome Back

Email
Password
Remember me
Forgot Password

Login

Don't have an account?
Register
```

## Register

Fields:

```text
Full Name
Email
Password
Confirm Password
```

## Forgot Password

```text
Email
Send Reset Link
Back to Login
```

---

# 13. Onboarding

Setelah register, user melalui onboarding singkat.

## Step 1 — Personal Information

```text
Age
Gender
Height
Weight
```

## Step 2 — Goal

Cards:

```text
Lose Weight
Build Muscle
Maintain Fitness
Improve General Health
```

## Step 3 — Activity Level

```text
Sedentary
Lightly Active
Moderately Active
Very Active
```

## Step 4 — Complete

```text
You're ready.

Start My Journey
```

Gunakan progress bar di atas.

---

# 14. User Dashboard

## Header

```text
Good morning, Azril 👋

Let's make today stronger.
```

## Main Hero Card

Pastel blue.

```text
Ready for today?

A workout makes
a better you.

[ Start Workout ]
```

Image atlet berada di sisi kanan.

## Today's Overview

4 mini cards:

```text
Workout Time
Calories
Exercises
Water
```

Warna:

```text
Time      → Blue
Calories  → Peach
Exercises → Green
Water     → Blue
```

## Progress Area

Cards:

```text
Current Weight
Weekly Activity
Nutrition Intake
```

Charts menggunakan:

- line chart,
- bar chart,
- donut/progress ring.

Library rekomendasi:

**Recharts**

---

# 15. Workout Library

## Header

```text
Workout Videos

Find workouts for every goal and level.
```

## Search

```text
Search workouts...
```

## Filter Chips

```text
All
Strength
Cardio
HIIT
Flexibility
Mobility
```

Additional filter:

```text
Beginner
Intermediate
Advanced
```

## Workout Card

Isi:

```text
Thumbnail
Play button
Duration
Workout title
Level
Target
```

Contoh:

```text
30 MIN
Full Body HIIT

With Sarah
Intermediate
```

Hover:

- image zoom kecil,
- card naik sedikit,
- play button lebih jelas.

---

# 16. Workout Detail

Isi halaman:

```text
Video Player

Workout Title
Description
Trainer
Duration
Difficulty
Target Muscle

Exercises list
Related workouts
```

## Muscle Target

Boleh menggunakan ilustrasi tubuh depan/belakang.

---

# 17. Nutrition Calculator

Layout desktop:

```text
LEFT
Nutrition form

RIGHT
Nutrition result
```

## Input

```text
Gender
Age
Height
Weight
Activity Level
Goal
```

## Result

Cards:

```text
Calories
Protein
Carbohydrates
Fat
```

Color mapping:

```text
Calories → Peach
Protein  → Green
Carbs    → Blue
Fat      → Peach
```

Main action:

```text
Calculate My Nutrition
```

Secondary action:

```text
Save as Daily Target
```

---

# 18. Progress Tracking

## Header Cards

```text
Current Weight
Body Fat
Workout This Month
Average Sleep
```

## Tabs

```text
Weight
Body Measurement
Photos
History
```

## Weight Chart

Line chart:

```text
X → Date
Y → Weight
```

## Body Measurement

```text
Chest
Waist
Hip
Arms
Thighs
```

## Add Progress

Button:

```text
+ Add Progress
```

Modal:

```text
Date
Weight
Body Fat (optional)
Notes
Progress Photo (optional)
```

---

# 19. Health Articles

## Header

```text
Health & Fitness Articles

Learn. Get inspired. Build a healthier you.
```

## Categories

```text
All
Nutrition
Workout
Mindset
Recovery
Lifestyle
```

## Article Card

Isi:

```text
Cover Image
Category
Title
Excerpt
Reading Time
Published Date
```

Grid desktop:

```text
3 columns
```

Mobile:

```text
1 column
```

---

# 20. Article Detail

Layout:

```text
Category
Title
Excerpt
Author
Date
Read time

Hero Image

Article Content

Related Articles
```

Content width jangan terlalu lebar.

Rekomendasi:

```css
max-width: 760px;
```

---

# 21. Profile

## Profile Card

```text
Avatar
Name
Email
Change Photo
```

## Tabs

```text
Personal Info
Goals
Preferences
Security
```

Fields:

```text
Full Name
Email
Date of Birth
Gender
Height
Weight
Location
```

Actions:

```text
Save Changes
Cancel
```

---

# 22. Settings

Sections:

```text
Account
Notifications
Privacy
Theme
Security
```

Untuk versi awal cukup:

```text
Email notifications
Change password
Logout
Delete account
```

---

# 23. Admin Dashboard

Admin mengikuti design system yang sama.

## Sidebar

```text
Dashboard
Users
Videos
Articles
Progress
Settings
Logout
```

## Summary Cards

```text
Total Users
Workout Videos
Articles
Progress Logs
```

## Charts

```text
User Growth
Monthly Activity
```

## Recent Users

```text
Avatar
Name
Email
Joined At
```

---

# 24. Admin Users

Table:

```text
Name
Email
Role
Joined
Status
Actions
```

Actions:

```text
View
Edit Role
Delete
```

Desktop table.

Mobile:

- cards,
- stacked rows.

---

# 25. Admin Workout Management

List:

```text
Thumbnail
Title
Category
Level
Duration
Status
Actions
```

Actions:

```text
Add Workout
Edit
Delete
```

## Add/Edit Workout

```text
Title
YouTube URL
Description
Category
Muscle Group
Level
Duration
Thumbnail
```

---

# 26. Admin Article Management

List:

```text
Cover
Title
Category
Author
Status
Published Date
Actions
```

Form:

```text
Title
Slug
Excerpt
Content
Image
Category
Status
```

---

# 27. Components

Buat reusable component.

```text
components/
├── Button
├── Input
├── Select
├── Textarea
├── SearchInput
├── Badge
├── Card
├── StatCard
├── WorkoutCard
├── ArticleCard
├── ProgressCard
├── NutritionCard
├── Modal
├── ConfirmDialog
├── Toast
├── Skeleton
├── EmptyState
├── Sidebar
├── Topbar
├── MobileNav
├── Avatar
├── Tabs
└── Pagination
```

---

# 28. Button System

## Primary

```text
Dark background / blue based on context
White text
```

## Secondary

```text
White or soft gray
Dark text
Border subtle
```

## Destructive

```text
Soft red / red
```

## Sizes

```text
sm
md
lg
```

---

# 29. Input System

Style:

```text
White background
1px soft border
12–14px radius
44–48px height
```

Focus:

```text
Blue border
Very soft blue glow
```

Error:

```text
Red border
Helper text below
```

---

# 30. Cards

Standard:

```css
background: #FFFFFF;
border-radius: 20px;
border: 1px solid #ECEDED;
```

Hero cards dapat menggunakan soft accent background.

---

# 31. Modal

Gunakan untuk:

- add progress,
- confirmation,
- delete,
- quick actions.

Desktop max width:

```text
480–600px
```

Mobile:

```text
bottom sheet or full width card
```

---

# 32. Toast

Positions:

```text
Desktop → top-right
Mobile → top-center
```

States:

```text
Success
Error
Warning
Info
```

---

# 33. Empty States

Contoh:

```text
No progress yet.

Start tracking your fitness journey.

[ Add Progress ]
```

Jangan hanya menampilkan tulisan `No Data`.

---

# 34. Loading States

Gunakan skeleton.

Contoh:

```text
Card skeleton
Workout card skeleton
Article skeleton
Chart skeleton
```

Hindari spinner fullscreen kecuali authentication checking.

---

# 35. Error States

## API Error

```text
Something went wrong.

We couldn't load this content.

[ Try Again ]
```

## Network Error

```text
You're offline.

Check your connection and try again.
```

---

# 36. 404 Page

```text
404

Looks like this workout went missing.

[ Back to Dashboard ]
```

Gunakan ilustrasi ringan sesuai FitJourney.

---

# 37. Responsive Mobile Navigation

Bottom navigation:

```text
Home
Workout
Nutrition
Progress
More
```

`More` membuka:

```text
Articles
Profile
Settings
Logout
```

---

# 38. Mobile Dashboard

Urutan:

```text
Header

Weekly Goal

Hero Workout Card

Quick Stats

Weight Progress

Weekly Activity

Nutrition Summary
```

Gunakan vertical scrolling.

---

# 39. Accessibility

Minimum:

- semantic HTML,
- keyboard navigation,
- visible focus,
- text contrast cukup,
- button icon memiliki `aria-label`,
- image memiliki alt,
- form memiliki label,
- error tidak bergantung pada warna saja.

---

# 40. Icons

Gunakan:

**Lucide React**

Aturan:

```text
Default size: 18–20px
Sidebar: 20–22px
Stroke width: 1.75–2
```

Jangan mencampur terlalu banyak icon library.

---

# 41. Image Direction

Foto harus:

- bersih,
- modern,
- pencahayaan natural,
- tidak terlalu gelap,
- background netral,
- outfit fitness minimal,
- sesuai target workout.

Gunakan crop konsisten.

```text
Workout card → landscape
Article card → landscape
Avatar → square
Hero → portrait / cutout
```

---

# 42. Animation

Gunakan ringan.

Rekomendasi:

```text
Card hover → 150–200ms
Button → 150ms
Modal → 200ms
Page transition → optional
```

Hindari animasi berlebihan.

---

# 43. Suggested Frontend Libraries

```text
React
React Router
Tailwind CSS
Lucide React
Recharts
Axios
React Hook Form
Zod (optional)
Framer Motion (optional)
```

---

# 44. Recommended Page Routes

## Public

```text
/
├── /login
├── /register
├── /forgot-password
├── /articles
└── /articles/:slug
```

## User

```text
/dashboard
/workouts
/workouts/:id
/nutrition
/progress
/articles
/articles/:slug
/profile
/settings
```

## Admin

```text
/admin
/admin/users
/admin/videos
/admin/videos/create
/admin/videos/:id/edit
/admin/articles
/admin/articles/create
/admin/articles/:id/edit
/admin/progress
/admin/settings
```

---

# 45. Design Priority

Implementasi UI dilakukan dalam urutan:

```text
01 Design System
02 Landing Page
03 Authentication
04 Onboarding
05 Dashboard
06 Workout Library
07 Workout Detail
08 Nutrition Calculator
09 Progress Tracking
10 Articles
11 Article Detail
12 Profile
13 Settings
14 Admin Dashboard
15 Admin CRUD
16 Loading / Error / Empty States
17 Mobile Responsive
18 Final UI Polish
```

---

# 46. Desktop Design Overview

```text
┌──────┬───────────────────────────────────────────────────┐
│      │ Search                              🔔   Avatar   │
│ LOGO │                                                   │
│      │ Page Title                                        │
│ 🏠   │                                                   │
│ 🏋️   │ ┌──────────────────┐ ┌──────────┐ ┌──────────┐ │
│ 🍴   │ │                  │ │          │ │          │ │
│ 📊   │ │    Main Card     │ │ Stat     │ │ Stat     │ │
│ 📄   │ │                  │ │          │ │          │ │
│      │ └──────────────────┘ └──────────┘ └──────────┘ │
│      │                                                   │
│ ⚙️   │ ┌──────────────────────┐ ┌────────────────────┐ │
│ 👤   │ │ Chart / Progress     │ │ Secondary Content  │ │
│      │ └──────────────────────┘ └────────────────────┘ │
└──────┴───────────────────────────────────────────────────┘
```

---

# 47. Mobile Design Overview

```text
┌────────────────────────┐
│ FitJourney           🔔 👤 │
│                        │
│ Good morning 👋        │
│                        │
│ ┌────────────────────┐ │
│ │ Hero / CTA         │ │
│ └────────────────────┘ │
│                        │
│ Quick Stats            │
│ ┌────────┐ ┌─────────┐ │
│ │        │ │         │ │
│ └────────┘ └─────────┘ │
│                        │
│ Progress               │
│ ┌────────────────────┐ │
│ │       Chart        │ │
│ └────────────────────┘ │
│                        │
├────────────────────────┤
│ 🏠   🏋️   🍴   📊   ••• │
└────────────────────────┘
```

---

# 48. Final Visual Principle

Setiap halaman FitJourney harus terasa sebagai bagian dari produk yang sama.

Gunakan prinsip:

> **Simple first. Data second. Decoration last.**

Tujuan utama desain FitJourney bukan hanya terlihat bagus, tetapi membuat pengguna mudah memahami:

- apa yang harus dilakukan,
- bagaimana progress mereka,
- apa target nutrisi mereka,
- workout apa yang cocok,
- informasi kesehatan apa yang berguna.

---

# 49. Final Design Identity

```text
Brand       : FitJourney
Tagline     : Move. Improve. Become.
Theme       : Light
Style       : Modern Clean Fitness SaaS
Typography  : Plus Jakarta Sans
UI          : Rounded, spacious, minimal
Workout     : Pastel Blue
Progress    : Pastel Green
Nutrition   : Soft Peach
Background  : Soft Gray
Cards       : White
Icons       : Lucide React
Charts      : Recharts
```

---

## Design Status

**Design direction: APPROVED**

Reference direction:

- clean fitness dashboard,
- compact icon sidebar,
- soft rounded cards,
- pastel functional colors,
- large whitespace,
- modern typography,
- responsive desktop + mobile.

Next phase:

**Implement Design System in React + Tailwind CSS.**
