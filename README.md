<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d2bc2bf2-d62c-4c6c-9054-a3574ef0c9a9

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Netlify

This project is now configured for Netlify with:

- `netlify.toml` build + redirects config
- `netlify/functions/api.js` serverless API for all `/api/*` routes
- SPA fallback routing for React Router

### Deploy Steps

1. Push this repository to GitHub.
2. In Netlify, select **Add new site** -> **Import an existing project**.
3. Connect your repo and keep these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify (if needed):
   - `GEMINI_API_KEY`
5. Deploy.

### Local Netlify Emulation (Optional)

Run this locally to test redirects/functions behavior:

`npm run dev:netlify`

### Important Note About Data

The API function currently uses in-memory state after loading your JSON files. On Netlify, function instances are ephemeral, so data changes are not guaranteed to persist across cold starts or deploys.

For persistent production data, move storage to a database (for example: Supabase, Neon Postgres, PlanetScale, MongoDB Atlas, or Fauna).
