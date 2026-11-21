# 🚀 MINDFORGE: UNBURDENING THE READER, UNLEASHING THE VISIONARY
**Master Architecture & Execution Blueprint for Antigravity IDE**  
**Budget:** 100% Free ($\text{Cost} = ₹0$) | **Target Users:** Students with Dyslexia | **Language Support:** English + Hinglish

---

## 1. SYSTEM DIRECTIVES FOR ANTIGRAVITY AI AGENT

> **CRITICAL INSTRUCTIONS FOR ANTIGRAVITY IDE:**
> Read this entire document before writing or modifying any code. You are building **MindForge**, an assistive learning ("Unburdening the Reader") and creative amplification ("Unleashing the Visionary") web application tailored for the dyslexic brain.
>
> 1. **100% Zero-Cost Constraint:** Do NOT use any paid APIs, paid SDKs, or backend servers requiring paid hosting. Use ONLY:
>    - Browser-native `window.speechSynthesis` (Text-to-Speech + word boundary tracking)
>    - Browser-native `webkitSpeechRecognition` / `SpeechRecognition` (Voice-to-Text Mic)
>    - HTML5 `<canvas>` (Sketching, Visual Mind-Mapping, and Multisensory Letter Tracing)
>    - `Mermaid.js` via free CDN (Auto Flowchart rendering)
>    - `localStorage` & `IndexedDB` (Client-side state, Brain Profile settings, and saved work)
>    - **Google Gemini 2.5 Flash API (Free Tier)** via direct client-side `fetch` calls using a user-supplied API key stored in `localStorage` (plus pre-loaded offline demo fallbacks so every button works even without an API key).
> 2. **Strict Neurological UX Compliance:**
>    - **NO Pure White or Pure Black:** Never use `#FFFFFF` backgrounds or `#000000` text. High contrast causes visual stress (Irlen Syndrome / Scotopic Sensitivity) where letters appear to vibrate or blur.
>    - **NO Justified Text:** Never use `text-align: justify`. Uneven word gaps create "rivers of white space" that break dyslexic eye tracking. Always enforce `text-align: left`.
>    - **Anti-Crowding Typography:** Enforce wide letter-spacing ($\ge 0.12\text{em}$), wide word-spacing ($\ge 0.25\text{em}$), generous line-height ($1.8$), and maximum line width ($65\text{ch}$).
> 3. **Zero Visual Clutter & Input Priority:**
>    - Never overwhelm the screen. Restrict navigation to **3 Big Color-Coded Tabs**:
>      1. `📖 Read & Absorb` (The Shield)
>      2. `🎨 Think & Create` (The Sword / Upper Hand)
>      3. `⚡ Brain Gym & Viva` (Oral Assessment & Spatial IQ)
>    - Prioritize **Microphone (`🎤`)** and **Camera/Image (`📷`)** inputs over typing everywhere.

---

## 2. HUMAN SUMMARY (Hinglish Overview for Developer)

Yeh project dyslexic students ko sirf "weak reader" maan kar unki reading fix karne tak limited nahi hai. Iska core philosophy hai **"Friction Down (Shield), Genius Up (Sword)"**:

1. **The Shield (Problems Solve Karna):**
   - **Visual Crowding:** Letters aapas mein चिपकते hain (jaise `r` + `n` = `m` dikhta hai), isliye hum `Lexend` aur `OpenDyslexic` fonts ke saath extra spacing aur Bionic Reading use karenge.
   - **Glare & Fatigue:** White background aankhon mein chubhta hai, isliye Warm Cream, Soft Yellow, aur Mint Pastel overlays honge.
   - **Decoding Overload:** Padhne mein dimag thak jata hai, isliye **Karaoke Text-to-Speech** (jahan bolne wala word yellow highlight hota hai) aur **2-Person Hinglish Podcast Mode** (Aarav aur Riya ki conversation) chapter ko kahani ki tarah sunayenge.
2. **The Sword (Creative Upper Hand Dena):**
   - Neuroscience (*The Dyslexic Advantage* — M.I.N.D. strengths) ke mutabiq dyslexic students ka **3D Spatial, Interconnected, aur Narrative thinking** normal logon se tez hota hai.
   - **Speak & Sketch Studio:** Student ko essay likhna nahi padega. Woh canvas par rough diagram draw karega aur mic mein apna idea bolega—AI dono ko jod kar ek top-grade Essay, Science Project Report, ya Code bana dega.
   - **Oral Viva Mode ("Teach the AI"):** Written test ke dar ko khatam karne ke liye student mic par bol kar AI ko topic samjhayega, aur AI spelling ignore karke sirf uske **Concept aur Logic** par marks dega.

---

## 3. STRICT CSS & TYPOGRAPHY SPECIFICATION (`styles/dyslexia-theme.css`)

Antigravity must implement these exact CSS variables and rules based on the **British Dyslexia Association (BDA)** Style Guide:

~~~css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.min.css');

:root {
  /* Default Comfort Theme: Warm Cream (Prevents Scotopic Glare) */
  --bg-primary: #FDFBF7;
  --bg-secondary: #F4EFE6;
  --text-primary: #1E293B; /* Soft Dark Charcoal - NEVER #000000 */
  --text-muted: #475569;
  --border-color: #CBD5E1;

  /* Action & Highlight Colors */
  --accent-blue: #2563EB;
  --accent-green: #059669;
  --accent-purple: #7C3AED;
  --accent-amber: #D97706;
  --karaoke-highlight: #FEF08A; /* Soft bright yellow for active spoken word */
  --karaoke-border: #CA8A04;

  /* BDA Dyslexia Typography Ratios */
  --font-family-main: 'Lexend', sans-serif;
  --base-font-size: 18px;
  --letter-spacing: 0.12em; /* 12% tracking stops letter merging */
  --word-spacing: 0.28em;   /* ~3.5x tracking for clear word boundaries */
  --line-height: 1.85;      /* Prevents skipping or repeating lines */
  --max-line-width: 65ch;   /* Optimal eye-span width */
}

/* User-Selectable Color Overlay Themes */
[data-theme="yellow"] {
  --bg-primary: #FFF9DB;
  --bg-secondary: #FFF3BF;
  --text-primary: #1E293B;
}

[data-theme="mint"] {
  --bg-primary: #E6FFFA;
  --bg-secondary: #B2F5EA;
  --text-primary: #1E293B;
}

[data-theme="sky"] {
  --bg-primary: #EBF8FF;
  --bg-secondary: #BEE3F8;
  --text-primary: #1E293B;
}

[data-theme="dark-comfort"] {
  --bg-primary: #1E293B;
  --bg-secondary: #334155;
  --text-primary: #F1F5F9;
  --text-muted: #CBD5E1;
  --karaoke-highlight: #854D0E;
}

/* Global Enforcement */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-family-main);
  font-size: var(--base-font-size);
  letter-spacing: var(--letter-spacing);
  word-spacing: var(--word-spacing);
  line-height: var(--line-height);
  text-align: left !important; /* NEVER justify */
  margin: 0;
  padding: 0;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.readable-column {
  max-width: var(--max-line-width);
}
~~~

---

## 4. TARGET PROJECT FILE STRUCTURE

Antigravity should organize the workspace cleanly into modular vanilla JavaScript files (zero build-step headaches, runs on any static server or `index.html` preview):

~~~text
mindforge-app/
├── index.html                  # Main SPA shell, CDN imports (Tailwind, Mermaid, Lucide Icons), 3-Tab layout
├── manifest.json               # PWA manifest for mobile/desktop installation
├── sw.js                       # Service Worker for offline caching
├── PLAN.md                     # This master specification file
├── styles/
│   └── dyslexia-theme.css      # BDA typography variables, themes, reading ruler, animations
└── scripts/
    ├── storage.js              # Manages localStorage (Brain Profile, API Key, Saved Notes, Progress)
    ├── demo-data.js            # Pre-cached fallback data so all AI features work even without an API key
    ├── gemini-service.js       # Free Gemini 2.5 Flash API client (Vision OCR, Podcast JSON, Mermaid, Viva)
    ├── speech-engine.js        # Web Speech API wrapper (Karaoke TTS, 2-Voice Podcast Player, Voice Mic Input)
    ├── reader-tools.js         # Bionic text formatter, Syllable splitter, Reading Ruler, Hinglish Dictionary
    ├── creative-studio.js      # Tab 2: HTML5 Canvas Sketchpad + Voice Ideation + Bubble-Map to Essay
    ├── brain-gym.js            # Tab 3: Oral Viva ("Teach the AI"), Lateral Thinking Puzzles, b/d Sand Tracer
    └── app.js                  # Main UI controller, Tab router, Onboarding Modal, Anti-Burnout Pacer
~~~

---

## 5. DETAILED MODULE & FEATURE SPECIFICATIONS

### MODULE 0: Global Header, Calibration & Anti-Burnout System
1. **"My Brain Profile" Calibration Modal (First-Time Setup & Settings Button):**
   - **Step 1 (Visual Comfort):** 5 big color cards (`Warm Cream`, `Soft Yellow`, `Cool Mint`, `Calm Sky`, `Dark Comfort`). Clicking any card updates the page live.
   - **Step 2 (Font & Spacing):** Switch between `Lexend` and `OpenDyslexic`. Includes 3 simple sliders: *Text Size* (`16px`–`26px`), *Letter Gap* (`0.08em`–`0.25em`), and *Line Spacing* (`1.5`–`2.4`).
   - **Step 3 (Free AI Key Optional Setup):** Input box for a free Google Gemini API key with a direct link to `https://aistudio.google.com/app/apikey`. If left blank, the app runs seamlessly in **Smart Demo Mode** using `demo-data.js`.
2. **Anti-Burnout Smart Pacer (Top Header Bar):**
   - **Why:** Dyslexic brains consume up to $3\times$ more energy while decoding text and experience anxiety from ticking numeric countdown timers.
   - **Design:** A calm, non-numbered horizontal progress bar at the top of the screen that smoothly transitions from Emerald Green to Warm Amber over a 20-minute study session.
   - **Trigger:** After 20 minutes (or via a manual *"Take Brain Break"* button), opens a 2-minute interactive **3D Spatial Breathing & Visual Reset Modal**.

---

### MODULE 1: 📖 TAB 1 — "READ & ABSORB" (The Shield)
*Eliminates mechanical reading friction and converts walls of text into bimodal audio + visuals.*

1. **Zero-Typing Input Bar:**
   - **📷 Scan Page (Camera / Photo Upload):** Student takes a photo of a textbook page or uploads an image. Sends Base64 image to Gemini 2.5 Flash Vision to extract clean text AND explain any diagrams on that page.
   - **🎤 Ask Topic by Voice:** Student speaks any topic (e.g., *"Photosynthesis kya hota hai?"* or *"Explain Ohm's Law $V = IR$"*) and loads a dyslexia-friendly lesson immediately.
   - **📋 Quick Paste / Demo Switcher:** Dropdown to load built-in curriculum samples (Science, History, Literature) for instant testing.
2. **Dyslexia Transformer Toolbar:**
   - **Bionic Reading Toggle (`Bionic ON/OFF`):** Wraps the first $40\%$ of every word in `<b>` tags (e.g., **Pho**tosynthesis **con**verts **sun**light) to provide visual anchor points for the eye.
   - **Syllable Splitter Toggle (`Syllables ON/OFF`):** Splits words with $\ge 7$ letters using raised dots (`Pho·to·syn·the·sis`) so students can decode sound chunks easily.
   - **Focus Reading Ruler (`Ruler ON/OFF`):** A horizontal highlight bar that follows the mouse cursor or touch Y-position while dimming the lines above and below by $50\%$.
3. **Bimodal Audio Engine:**
   - **🔊 Karaoke Read-Aloud:** Uses `window.speechSynthesis`. As each word is spoken, the `onboundary` event highlights that exact word in bright yellow (`--karaoke-highlight`) and scrolls it smoothly into view. Includes Speed controls (`0.75x`, `1.0x`, `1.25x`).
   - **🎧 2-Person Hinglish Podcast Mode (Signature Feature):**
     - Converts boring textbook chapters into an engaging 2-minute Hinglish conversation between two friendly hosts: **Aarav** (Curious student asking questions) and **Riya** (Smart mentor explaining with real-life desi analogies).
     - `speech-engine.js` plays Aarav's lines at `pitch: 0.9, rate: 1.0` and Riya's lines at `pitch: 1.2, rate: 1.05` while highlighting the active speaker card!
4. **🇮🇳 Tap-to-Hinglish Visual Dictionary:**
   - Double-clicking or tapping any word in the reader opens a floating helper card displaying:
     - **Syllable Breakdown:** e.g., `Chlo · ro · phyll`
     - **Simple Hinglish Meaning:** *"Paudhon ke patton mein paya jane wala hara pigment jo sunlight pakadta hai."*
     - **Visual Anchor Emoji:** 🌿☀️
     - **🔊 Hear Word Button:** Speaks just that word slowly (`rate: 0.8`).
5. **🧠 1-Click Visual Flowchart (`Mermaid.js`):**
   - Clicking **"Convert Text to Visual Map"** transforms the paragraph into a color-coded node flowchart rendered directly below the text so visual thinkers grasp the big picture in seconds.

---

### MODULE 2: 🎨 TAB 2 — "THINK & CREATE" (The Sword / Creative Upper Hand)
*Turns dyslexic visual-spatial and interconnected thinking into high-scoring essays, reports, and blueprints without typing.*

1. **"Speak & Sketch" Multimodal Studio:**
   - **Interactive HTML5 Canvas Whiteboard:** Equipped with Freehand Pen, 5 high-contrast colors, Rectangle/Circle/Arrow tools, Eraser, and Clear Canvas.
   - **Simultaneous Voice Recording (`🎤 Speak Idea`):** Student sketches a rough diagram, story scene, or machine invention on the canvas while speaking freely in Hinglish or English (e.g., *"Yahan upar solar panel hai jo battery charge karega aur niche automatic water pump chalega..."*).
   - **✨ "Turn Sketch + Voice into Masterpiece" Button:**
     - Captures `canvas.toDataURL('image/png')` + the spoken transcript and sends both to Gemini 2.5 Flash Multimodal API.
     - Generates 3 structured tabs of output:
       1. **📝 Polished School Essay / Project Report** (Grammatically perfect English ready to submit)
       2. **🎯 Key Bullet Summary & Scientific Principles**
       3. **🚀 Real-World Upgrade Ideas** (How to make their invention even better)
2. **Visual Bubble-Map to Essay Builder:**
   - Allows students to click **"+ Add Idea Bubble"** to spawn draggable visual nodes on the workspace, connect them with arrows, speak 2-3 words into each bubble, and convert the entire visual web into a structured paragraph with one click.

---

### MODULE 3: ⚡ TAB 3 — "BRAIN GYM & VIVA" (Oral Assessment & Superpower Training)
*Evaluates knowledge without penalizing spelling and builds phonological + spatial confidence.*

1. **🗣️ "Teach the AI" (Oral Viva Exam Mode):**
   - **How it works:** Student selects a topic. The AI says: *"Pretend I am a 10-year-old kid. Click the Mic and explain this topic to me in your own words (Hinglish or English)!"*
   - **Grading Logic:** Student speaks their explanation. Gemini evaluates ONLY **Conceptual Understanding, Logic, and Use of Examples** (100% ignoring spelling or grammar mistakes).
   - **Output:** Displays a celebratory **Concept Score (out of 10)**, **What You Nailed (Strengths)**, **1 Missing Puzzle Piece (Hint)**, and reads the feedback aloud.
2. **🧩 "Fix the Broken System" (Lateral Thinking & Ingenuity Challenge):**
   - Presents real-world visual engineering/design scenarios where dyslexic big-picture thinking shines (e.g., *"Heavy rain floods a school courtyard every monsoon because the drain gets blocked by dry leaves. Without buying expensive machines, design a clever mechanical fix!"*).
   - Student speaks their creative solution; AI awards an **Out-of-the-Box Ingenuity Badge** (`3D Architect`, `Systems Genius`, `Jugaad Innovator`).
3. **✍️ Multisensory Sand & Glow Letter Tracer (`b` vs `d` / `p` vs `q`):**
   - Addresses Mirror Invariance (`b`/`d` and `p`/`q` confusion).
   - Features the visual **"b-e-d Thumbs Trick"** guide alongside a tactile particle-glow HTML5 Canvas where students trace letters with their finger or mouse while hearing the phonetic sound (*"/b/ — line down, bounce up and around for bat"*).

---

## 6. TECHNICAL IMPLEMENTATION REFERENCE (For Antigravity Code Generation)

### 6.1 Free Gemini 2.5 Flash API Wrapper (`scripts/gemini-service.js`)
Use standard REST `fetch` so no Node/NPM backend is required:

~~~javascript
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGeminiAPI(promptText, base64Image = null, mimeType = "image/png") {
  const apiKey = localStorage.getItem("mindforge_gemini_key");
  if (!apiKey) {
    throw new Error("DEMO_MODE"); // Triggers instant fallback to demo-data.js
  }

  const parts = [{ text: promptText }];
  if (base64Image) {
    const cleanBase64 = base64Image.split(",")[1] || base64Image;
    parts.push({
      inline_data: { mime_type: mimeType, data: cleanBase64 }
    });
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }]
    })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
~~~

### 6.2 Karaoke Word-by-Word Highlighting (`scripts/speech-engine.js`)
Tokenize the reader text into indexed `<span data-char-index="...">` elements so `utterance.onboundary` highlights the exact spoken word:

~~~javascript
utterance.onboundary = (event) => {
  if (event.name === "word") {
    const charIndex = event.charIndex;
    highlightWordAtCharIndex(charIndex);
  }
};
~~~

---

## 7. SEQUENTIAL PROMPTS FOR ANTIGRAVITY IDE

Copy-paste these **6 prompts one by one** into the Antigravity IDE chat window after placing this `PLAN.md` file in your project root:

---

### ▶️ PROMPT 1: Phase 1 — Core Layout, BDA Theme Engine & Brain Profile
~~~text
Read PLAN.md completely. Execute PHASE 1: Project Scaffold, BDA Dyslexia Theme Engine, and Onboarding.
1. Create the directory structure defined in Section 4 of PLAN.md.
2. Create `styles/dyslexia-theme.css` implementing all CSS variables, color overlays (Warm Cream default, Soft Yellow, Mint, Sky, Dark Comfort), Lexend & OpenDyslexic fonts, dynamic typography rules, and the Focus Reading Ruler styles.
3. Create `scripts/storage.js` and `scripts/demo-data.js` (with rich pre-built Science & History demo lessons, Hinglish podcast dialogues, Mermaid flowcharts, and dictionary entries so the app works 100% even before an API key is added).
4. Create `index.html` and `scripts/app.js` featuring:
   - The Top Header with App Branding, the smooth non-ticking 20-minute "Anti-Burnout Pacer Bar" + "Brain Break" modal, Quick Theme/Font controls, and the "My Brain Profile" Calibration Modal.
   - The 3 Big Color-Coded Navigation Tabs: "📖 Read & Absorb", "🎨 Think & Create", and "⚡ Brain Gym & Viva".
Ensure the UI renders cleanly with zero console errors.
~~~

---

### ▶️ PROMPT 2: Phase 2 — Dyslexia Reader, Bionic Text & Karaoke TTS
~~~text
Read PLAN.md and execute PHASE 2: Tab 1 ("📖 Read & Absorb" - Local Dyslexia Transformer & Bimodal Audio).
1. In `scripts/reader-tools.js`, implement:
   - Bionic Reading toggle (bolding the first 40% of each word).
   - Syllable Splitter toggle (inserting middle dots `·` into words with 7+ letters).
   - Interactive Focus Reading Ruler that tracks mouse/touch Y-coordinates.
   - Tap-to-Hinglish Visual Dictionary popup when any word in the reader is clicked/double-clicked (showing syllables, simple Hinglish meaning, emoji, and single-word audio button).
2. In `scripts/speech-engine.js`, implement Browser Native Text-to-Speech (`window.speechSynthesis`) with Play, Pause, Stop, Speed selector (0.75x, 1x, 1.25x), and real-time yellow word highlighting (`onboundary` event).
3. Connect all controls into Tab 1 in `index.html`.
~~~

---

### ▶️ PROMPT 3: Phase 3 — Gemini Vision Scanner, 2-Host Hinglish Podcast & Mermaid Flowchart
~~~text
Read PLAN.md and execute PHASE 3: AI & Visual Learning Features in Tab 1 ("📖 Read & Absorb").
1. In `scripts/gemini-service.js`, implement the `callGeminiAPI` wrapper for `gemini-2.5-flash` with automatic fallback to `scripts/demo-data.js` if no API key is set.
2. Wire up the 3 Smart Learning tools in Tab 1:
   - 📷 Textbook Page Scanner (Image upload/camera capture -> Gemini Vision OCR -> loads clean text + diagram summary into the reader) and 🎤 Voice Topic Search (`webkitSpeechRecognition`).
   - 🎧 2-Person Hinglish Podcast Player: Generates/loads a dialogue between "Aarav" and "Riya" in Hinglish and plays it aloud using two distinct voice pitches in `speech-engine.js` while highlighting the active speaker bubble.
   - 🧠 1-Click Visual Flowchart: Generates/loads `Mermaid.js` syntax (`graph TD`) for the current lesson and renders an interactive visual diagram.
~~~

---

### ▶️ PROMPT 4: Phase 4 — "Think & Create" Studio (Speak + Sketch to Essay)
~~~text
Read PLAN.md and execute PHASE 4: Tab 2 ("🎨 Think & Create" - The Dyslexic Upper Hand Studio) in `scripts/creative-studio.js`.
1. Build an interactive HTML5 `<canvas>` Whiteboard supporting freehand drawing, color selection, basic shapes (box, circle, arrow), eraser, and clear.
2. Add a "🎤 Speak Idea While Sketching" toggle using `webkitSpeechRecognition` (with an editable transcript box and a sample "Smart Rainwater Harvester Idea" demo button).
3. Add the "✨ Turn Sketch + Voice into Masterpiece" button that combines `canvas.toDataURL()` + the spoken transcript via Gemini 2.5 Flash (or demo fallback) to generate:
   - A structured Academic Essay / Science Project Report
   - Key Conceptual Bullet Points
   - Real-World Engineering Upgrade Ideas
4. Include a "🔊 Read My Generated Essay" button and a "📋 Copy Text" button.
~~~

---

### ▶️ PROMPT 5: Phase 5 — "Brain Gym & Viva" (Oral Exam, Lateral Thinking & Sand Tracer)
~~~text
Read PLAN.md and execute PHASE 5: Tab 3 ("⚡ Brain Gym & Viva") in `scripts/brain-gym.js`.
1. 🗣️ "Teach the AI" (Oral Viva Mode):
   - Student picks a topic and explains it via microphone (or clicks a sample spoken response).
   - Evaluates ONLY conceptual understanding and creative analogies (never deducting points for spelling/grammar), displaying a Score out of 10, Strengths, and a friendly Hinglish tip with audio playback.
2. 🧩 "Fix the Broken System" (Lateral Thinking Arena):
   - Displays real-world visual engineering/design puzzles where students speak their out-of-the-box solution and earn a Dyslexic Advantage Superpower Badge.
3. ✍️ Multisensory Sand & Glow Letter Tracer:
   - Interactive canvas for practicing 'b' vs 'd' and 'p' vs 'q' with the visual "b-e-d Thumbs Trick" guide, glowing particle strokes, and phonetic audio pronunciation.
~~~

---

### ▶️ PROMPT 6: Phase 6 — PWA Offline Support & Final Accessibility Audit
~~~text
Read PLAN.md and execute PHASE 6: Progressive Web App (PWA) & Final Accessibility Polish.
1. Create `manifest.json` and `sw.js` (Service Worker) and register it in `index.html` so students can install MindForge as a standalone desktop or mobile app.
2. Perform a complete UX audit against Section 1 and Section 3 of PLAN.md:
   - Verify no pure white (`#FFFFFF`) or pure black (`#000000`) exists.
   - Verify all text is left-aligned (`text-align: left`).
   - Verify every button has both a clear icon/emoji and a readable label.
   - Ensure all 3 tabs, audio controls, canvas tools, and demo fallbacks work smoothly with zero errors.
~~~

---

### ▶️ PROMPT 7: Phase 7 — Comprehensive Security Hardening & Zero-Exposure API Integration
~~~text
Execute PHASE 7: Security Hardening, API Key Privacy & Enterprise Protection.
1. Environment & Git Protection:
   - Create root `.env` with placeholder variables and `.env.example` for developer onboarding.
   - Configure `.gitignore` to strictly exclude `.env`, `.env.*`, `node_modules/`, `dist/`, `build/`, `*.log`, `*.key`, `*.pem`, and `.vercel/`.
2. Zero-Exposure Gemini API Architecture:
   - Never expose API keys in URL parameters (`?key=...`); authenticate strictly via `x-goog-api-key` HTTP header.
   - Support reading from `import.meta.env.VITE_GEMINI_API_KEY` (bundler/dev) with fallback to `localStorage`.
   - Provide production serverless proxy at `api/gemini.js` (Vercel) keeping keys 100% hidden on server.
   - Add "🔒 Clear API Key & Wipe Local Data" button with confirmation to wipe keys, session data, and cache.
3. Strict XSS & DOM Injection Defense:
   - Escaped all dynamic HTML/Markdown interpolations using `escapeHtml()`.
   - Initialized Mermaid with `securityLevel: 'strict'`.
4. Content Security Policy (CSP) & Input Hardening:
   - Strict `<meta http-equiv="Content-Security-Policy">` in `index.html`.
   - Minimum 2-second client-side cooldown rate limiter.
   - File validation enforcing JPEG, PNG, WebP format and <= 4MB size limits.
~~~