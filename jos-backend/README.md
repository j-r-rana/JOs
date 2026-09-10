# JOs — Zero to Skill — Backend

Backend for the JOs platform, built to match the architecture and data model
from your PBL-I deck (slides 9–10): **Next.js API Routes + MongoDB Atlas +
Gemini API**, ready to deploy on Vercel.

## What's included

```
jos-backend/
├── lib/
│   ├── dbConnect.js     # cached Mongoose connection (safe for serverless)
│   ├── auth.js          # JWT sign/verify + requireUser() guard
│   └── gemini.js        # Gemini wrapper for AI learning + code evaluation
├── models/              # one file per collection from your data model slide
│   ├── User.js
│   ├── Domain.js
│   ├── Skill.js
│   ├── Prompt.js
│   ├── Quiz.js
│   ├── CodeChallenge.js
│   ├── Progress.js
│   ├── UserStats.js
│   ├── CoinTransaction.js
│   ├── Achievement.js
│   └── UserAchievement.js
├── app/api/
│   ├── auth/register, auth/login       # signup/login, returns a JWT
│   ├── domains                          # GET list / POST create (public)
│   ├── domains/[id]/skills              # GET skills in a domain
│   ├── skills/[id]                      # GET skill + prompts + progress (login required)
│   ├── skills/by-slug/[domainSlug]/[skillSlug]  # GET skill by human-readable slugs
│   ├── quizzes/submit                   # POST — grades quiz, pays coins on reward-quiz pass
│   ├── code/evaluate                    # POST — sends code to Gemini, returns evaluation
│   ├── progress                         # GET — student's progress across all skills
│   ├── users/me                         # GET — profile + coin/streak stats
│   └── achievements                     # GET — all achievements + which are earned
├── scripts/seed.js       # seeds ALL 4 live domains with real content (see below)
├── package.json
└── .env.example
```

This covers the **core loop** from your slides: Choose Domain → Choose Skill
→ Read Playbook → AI Learning Prompt → Code Practice → AI Evaluation →
Practice/Reward Quiz → Coins/Achievements → Progress.

## Setup

```bash
npm install
cp .env.example .env    # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run seed             # seeds all domains/skills/quizzes — see below
npm run dev               # http://localhost:3000
```

## What `npm run seed` creates

Running the seed script wipes and recreates the `Domain`, `Skill`, `Prompt`,
`Quiz`, `CodeChallenge`, and `Achievement` collections with real content —
**not placeholders** — matching `jos-frontend`'s fixtures exactly (same
question text, option order, and `correctIndex` values, since grading
happens server-side against these):

| Domain | Skills |
|---|---|
| Web Development | HTML, CSS, JavaScript, React |
| Backend Engineering | Node.js, Express.js, REST APIs, MongoDB |
| Cyber Security | Linux Hardening, OWASP Top 10 |
| Data Science & AI | NumPy & pandas, ML Concepts |

Each skill gets: one AI tutor Learning Prompt, a code challenge (if
`hasCodePractice`), a 3-question practice quiz, and a 7-question reward quiz
(50 coins on a passing score) — matching the "Learn → Practice → Validate →
Earn" loop from your deck. It also prints every domain/skill's real MongoDB
`_id` to the console, useful for testing endpoints directly with curl/Postman
before wiring up the frontend.

The frontend resolves these automatically via
`/api/skills/by-slug/:domainSlug/:skillSlug` — you don't need to copy IDs
around manually for the app to work end-to-end.

- **MONGODB_URI**: create a free cluster at MongoDB Atlas, get the connection string.
- **JWT_SECRET**: any long random string (e.g. `openssl rand -hex 32`).
- **GEMINI_API_KEY**: from Google AI Studio.

## Auth flow

1. `POST /api/auth/register` `{ name, email, password }` → `{ token, user }`
2. `POST /api/auth/login` `{ email, password }` → `{ token, user }`
3. Send the token on every protected request: `Authorization: Bearer <token>`

Protected routes (`requireUser`): `skills/[id]`, `quizzes/submit`,
`code/evaluate`, `progress`, `users/me`, `achievements` — matching the access
rule on slide 8 ("Home & About → Public, Learning features → Login
required").

## What's intentionally left for you to extend

- **Playbook content itself** — the deck says PDFs are stored externally and
  referenced by URL (slide 10's design decision), so `Skill.playbookUrl`
  just points at wherever you host them (S3, Vercel Blob, etc.). No file
  upload endpoint is included yet.
- **Streaks** — `UserStats.streakCount`/`lastActiveDate` exist, but the
  daily-activity check that increments/resets a streak isn't wired up. A
  clean spot for it is a small check inside `users/me` or a scheduled job.
- **Achievement-unlocking logic** — `Achievement`/`UserAchievement` models
  and the read endpoint exist; the code that actually evaluates criteria
  (e.g. "5 skills completed") and creates `UserAchievement` rows isn't
  written yet — add it wherever progress/quiz events happen.
- **Role checks** — `domains POST` and any future admin/faculty dashboard
  endpoints should check `user.role === "faculty"` before writing.
- **Rate limiting on `/api/code/evaluate`** — each call spends a Gemini
  request; worth throttling per user before this goes live.

## Notes on choices made

- **Next.js App Router route handlers**, not a separate Express server —
  matches "Backend: Next.js Route Handlers / API" on slide 9 exactly, and
  deploys as one Vercel project alongside your frontend.
- **JWT in an Authorization header**, not cookies — simplest to test from
  Postman/curl and works the same whether your frontend is the Next.js PWA
  or something else later.
- **CoinTransaction as an append-only ledger** rather than only incrementing
  `UserStats.coins` — so coin totals are always auditable/rebuildable,
  which is the kind of thing faculty may ask about in review.
