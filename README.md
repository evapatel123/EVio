# EVio

EVio is a framework-free student success frontend with a dependency-free Node.js backend. The chatbot backend is intentionally kept external and loads through the existing iframe.

## Run locally

Requirements: Node.js 18+

```bash
npm start
```

Then open `http://localhost:3000`.

## Backend

The Node server in `server.js` serves the HTML/CSS/JS and exposes JSON APIs for:

- dashboard state and progress
- tasks (create, update, delete, complete)
- planner schedule items
- weekly goals
- major quiz results
- resource hub data
- profile/settings persistence

Data is stored in `data/evio-data.json` for this single-user/guest prototype. This is intentionally simple so the site has no framework or external database dependency.

## Chatbot

The chatbot is not integrated into this backend. Set `CHATBOT_URL` at the top of `script.js` to the deployed Gradio/Hugging Face chatbot URL. The existing iframe will load it without changing the rest of the site.

## Branding

`assets/evio-logo.svg` and `assets/evio-banner.svg` are original SVG recreations based on the provided EVio logo/banner reference. The supplied raster images are not used by the website.
