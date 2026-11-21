# ⚡ MindForge: Unburdening the Reader, Unleashing the Visionary

> **Assistive learning, spatial reasoning, and creative amplification web application tailored for the dyslexic mind.**

MindForge is built strictly according to **British Dyslexia Association (BDA)** guidelines, featuring scotopic color overlays, dynamic typography, bimodal audio karaoke, 2-host Hinglish podcasts, visual Mermaid flowcharts, multimodal canvas-to-essay synthesis, and oral viva assessment.

---

## 🔑 Where & How to Add Your Free Google Gemini API Key

MindForge is designed with **zero-cost accessibility** in mind. You can run the app in **Smart Demo Mode** completely free without an API key, or connect your free Google Gemini API key using any of the following three methods:

### Option 1: In the App Interface (Easiest — Recommended for Local & Desktop Use)

1. Get a 100% free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open MindForge in your browser.
3. Click the **⚙️ My Brain Profile** button in the top navigation bar.
4. Scroll down to **Step 3: Optional Free Gemini AI Key**.
5. Paste your key (`AIzaSy...`) and click **✅ Save & Apply Settings**.

> **Privacy Guarantee:** The key is stored locally in your browser's private `localStorage` under `mindforge_gemini_key`. It is **never sent to any third-party server** and is transmitted directly to Google's API using the secure `x-goog-api-key` HTTP request header (never exposed in URL query parameters or server logs).

---

### Option 2: In Root `.env` (For Bundlers / Vite / Local Dev)

If you are running MindForge with a bundler or local dev server:

1. Open the `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   APP_ENV=development
   ```
2. Replace `your_actual_gemini_api_key_here` with your key from Google AI Studio.
3. MindForge automatically detects this fallback key on startup.

> **Security Note:** `.env` is pre-configured in `.gitignore` and will never be committed to Git. A safe `.env.example` template is provided for team collaboration.

---

### Option 3: Production Serverless Proxy on Vercel (100% Client-Hidden Key)

MindForge includes a production-grade, zero-cost Vercel Serverless Function at `api/gemini.js`:

1. Push your project to GitHub (your `.env` is automatically ignored by `.gitignore`).
2. Deploy to [Vercel](https://vercel.com).
3. In your Vercel Dashboard, navigate to **Project Settings > Environment Variables**.
4. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `your_gemini_api_key_here`
5. Click **Save** and redeploy.

**How it works:**
- When deployed to Vercel, requests to `/api/gemini` run securely on the server.
- The API key stays 100% hidden on the server and is never transmitted to the user's browser.
- Includes automatic server-side rate-limiting (30 requests/minute per IP) and strict request validation to prevent proxy abuse.

---

### Option 4: Smart Offline Demo Mode (Zero API Key Needed)

If you don't enter an API key, MindForge runs seamlessly in **Smart Demo Mode**:
- Full academic lesson library (Photosynthesis, Indus Valley Civilization, Gravity & Orbits, Ohm's Law).
- Fully voiced 2-host Hinglish dialogues between **Aarav** (inquisitive student) and **Riya** (mentor).
- Interactive Mermaid.js concept flowcharts.
- Multisensory Sand & Glow letter tracer with phonetic audio rhymes.
- Lateral thinking puzzles with out-of-the-box mechanical engineering badges.

---

## 🔒 Security Hardening Architecture

MindForge is fortified with enterprise application security best practices:

| Defense Layer | Implementation |
| :--- | :--- |
| **API Key Privacy** | Keys are transmitted via `x-goog-api-key` HTTP request header, completely preventing leakage in URL parameters, browser histories, proxy logs, and `Referer` headers. |
| **Content Security Policy (CSP)** | Strict `<meta http-equiv="Content-Security-Policy">` restricting executable scripts, fonts, stylesheets, and connections exclusively to authorized origins (`'self'`, Google Fonts, jsDelivr, Google Gemini API). |
| **XSS & DOM Injection Defense** | All user transcripts, OCR text, and AI responses are sanitized using `escapeHtml()` and safe DOM nodes (`document.createElement`, `textContent`) prior to rendering. |
| **Mermaid Security** | Initialized with `securityLevel: 'strict'` to prevent arbitrary JavaScript execution inside AI-generated flowchart node definitions. |
| **Client Rate Limiting** | Enforces a minimum 2-second cooldown between Gemini API calls to prevent quota exhaustion and accidental double-firing. |
| **Serverless Rate Limiting** | `api/gemini.js` includes a sliding-window rate limiter restricting requests to 30 calls per minute per IP address with `429 Too Many Requests` responses. |
| **Input Validation** | File upload validator enforces strict 4MB size limits, valid MIME types (`image/jpeg`, `image/png`, `image/webp`), and file extension checks. |
| **One-Click Local Data Wipe** | Prominent "🔒 Clear API Key & Wipe Local Data" button in settings that instantly clears all `mindforge_*` keys, `sessionStorage`, and Service Worker cache storage. |

---

## 🚀 How to Run MindForge

### Simple Static File Server (Python / VS Code Live Server)

```powershell
# Using Python
python -m http.server 8080

# Or using Node http-server / npx serve
npx serve .
```

Open your browser at `http://localhost:8080`.

### Progressive Web App (PWA)

MindForge is fully PWA-enabled with a Web App Manifest (`manifest.json`) and Service Worker (`sw.js`). You can click the **Install App** button in the browser address bar to install MindForge as a native standalone app on Windows, macOS, Android, or iOS.

---

## 🛠️ Project Structure

```text
mindforge/
├── .env                  <- Local environment variables (ignored by Git)
├── .env.example          <- Safe template for environment variables
├── .gitignore            <- Git protection rules for secrets & logs
├── vercel.json           <- Deployment config with strict HTTP security headers
├── manifest.json         <- Progressive Web App (PWA) manifest
├── sw.js                 <- Service Worker for offline asset caching
├── presentation.html        <- 18-slide interactive pitch deck web application
├── PRESENTATION_SCRIPT.md   <- 5-presenter pitch script with timings and Q&A battlecard
├── video-explainer.html     <- 5-minute 1080p explainer video player & MP4 recorder (Warm Cream BDA Theme)
├── VIDEO_SCRIPT_AND_CHAPTERS.md <- Complete 5-minute timeline and narration script (10 chapters x 30s)
├── FEATURES_AND_WORKINGS.md <- Comprehensive technical & feature documentation
├── index.html            <- Main single-page interface with strict CSP & BDA layout
├── styles/
│   └── dyslexia-theme.css <- BDA scotopic color overlays, typography, UI layout
├── scripts/
│   ├── storage.js        <- Brain profile storage, API key manager, and data wipe
│   ├── gemini-service.js <- Secure Gemini 2.5 Flash API wrapper & rate limiter
│   ├── reader-tools.js   <- Bionic reader, syllable splitter, ruler, dictionary
│   ├── speech-engine.js  <- Web Speech API engine for karaoke TTS & mic speech
│   ├── creative-studio.js<- Canvas whiteboard, speech-to-essay synthesis
│   ├── brain-gym.js      <- Oral viva examiner, lateral thinking, sand tracer
│   ├── demo-data.js      <- Offline curriculum lessons, podcasts & badges
│   └── app.js            <- Application orchestrator & modal controllers
└── api/
    └── gemini.js         <- Zero-cost secure Vercel serverless proxy
```

---

## 📄 License & Credits

Built with ❤️ for neurodivergent minds everywhere. Designed according to the standards of the British Dyslexia Association (BDA).
