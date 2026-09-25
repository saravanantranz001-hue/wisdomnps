<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# WISDOM Nursery and Primary School - Essur

School management portal for WISDOM Nursery and Primary School - Essur.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d3514fc1-2fa8-497c-8319-4d3e0a8494c3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow manually.

The workflow builds the Vite application and publishes the `dist` folder automatically.
