# Big Dawg HQ

A Vite + React + Supabase version of the Big Dawg HQ task/bill tracker.

## 1. Install

```bash
npm install
cp .env.example .env
```

## 2. Create Supabase project

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Go to Project Settings → API.
5. Copy the Project URL and anon/public key into `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm run dev
```

Open the local Vite URL, create an account, and sign in. The first sign-in seeds your default tasks and bills.

## 4. Deploy

Push this folder to GitHub, then import the repo into Vercel.

Add the same environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then redeploy.

## Notes

- The app uses Supabase Auth.
- Row-level security is enabled, so users only see their own tasks/bills.
- The Supabase anon key is safe to expose in a client app when RLS policies are correctly configured.
