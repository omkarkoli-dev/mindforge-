# ⚡ MindForge: Complete Features & Architectural Blueprint

> **Official Product Documentation & System Architecture Manual**  
> **Tagline:** *Unburdening the Reader, Unleashing the Visionary*  
> **Target Audience:** Neurodivergent Students (Dyslexia, ADHD), Special Educators, Parents & Developers  
> **Compliance Standard:** British Dyslexia Association (BDA) Style Guide & National Education Policy (NEP 2020)

---

## 📑 Table of Contents

1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [High-Level Technical Architecture](#2-high-level-technical-architecture)
3. [Global Systems & Ergonomic Controls](#3-global-systems--ergonomic-controls)
4. [Tab 1: Read & Absorb (The Shield)](#4-tab-1-read--absorb-the-shield)
5. [Tab 2: Think & Create Studio (The Sword)](#5-tab-2-think--create-studio-the-sword)
6. [Tab 3: Brain Gym & Viva Arena (Oral Assessment & Spatial IQ)](#6-tab-3-brain-gym--viva-arena-oral-assessment--spatial-iq)
7. [AI Integration & Dual Execution Paths](#7-ai-integration--dual-execution-paths)
8. [Security Hardening & Privacy Architecture](#8-security-hardening--privacy-architecture)
9. [Local Execution & Production Deployment](#9-local-execution--production-deployment)

---

## 1. Executive Summary & Core Philosophy

Traditional education measures human intelligence through a single, narrow bandwidth: **2D flat text decoding and written spelling**. For a student with dyslexia, physical reading burns up to **3x more metabolic glucose** in the brain due to visual crowding, scotopic glare, and phonological tracking friction.

MindForge is built on the landmark clinical research of Dr. Brock and Fernette Eide (*The Dyslexic Advantage*). Dyslexia is not a cognitive deficit; it is a brain specialization characterized by longer right-hemisphere neural mini-columns optimized for **Material (3D spatial), Interconnected, Narrative, and Dynamic (M.I.N.D.) reasoning**.

MindForge operationalizes this neuroscience through two complementary pillars:

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                          MINDFORGE                          │
       │        "Unburdening the Reader, Unleashing the Visionary"    │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────────┐                   ┌───────────────────────────────┐
│     THE SHIELD (Friction Down) │                   │      THE SWORD (Genius Up)    │
│    "Unburdening the Reader"   │                   │  "Unleashing the Visionary"   │
├───────────────────────────────┤                   ├───────────────────────────────┤
│ • Scotopic Color Overlays     │                   │ • Canvas Whiteboard Sketching │
│ • Bionic Reading Anchors      │                   │ • Voice-Stream Transcription  │
│ • Syllable Splitter (·)       │                   │ • Multimodal Essay Synthesis  │
│ • Focus Reading Ruler Overlay │                   │ • Spelling-Free Oral Viva AI  │
│ • Bimodal Audio Karaoke       │                   │ • Lateral Engineering Arena   │
│ • 2-Host Hinglish Podcasts    │                   │ • Multisensory Sand Tracer    │
│ • 1-Click Concept Flowcharts  │                   │ • Superpower Badges Portfolio │
└───────────────────────────────┘                   └───────────────────────────────┘
```

---

## 2. High-Level Technical Architecture

MindForge is designed as a **zero-marginal-server-cost**, client-side Progressive Web App (PWA). It requires no paid databases, runs completely in modern browsers, and works seamlessly even on low-end hardware and offline environments.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER (EDGE PWA)                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│  │   BDA Theme Engine   │  │   Web Speech API     │  │  HTML5 Canvas  │ │
│  │ • 5 Scotopic Colors  │  │ • TTS (Word Tracking)│  │ • Whiteboard   │ │
│  │ • Lexend / Dyslexic  │  │ • Speech Recognition │  │ • Sand Tracer  │ │
│  └──────────────────────┘  └──────────────────────┘  └────────────────┘ │
│                                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐ │
│  │   Storage Service    │  │  Service Worker PWA  │  │ Mermaid.js CDN │ │
│  │ • Brain Profile      │  │ • sw.js Cache First  │  │ • Strict Mode  │ │
│  │ • Study Stats/Badges │  │ • Offline Assets     │  │ • Flowcharts   │ │
│  └──────────────────────┘  └──────────────────────┘  └────────────────┘ │
│                                                                          │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────┐                   ┌───────────────────────────────┐
│     CLIENT DIRECT API MODE    │                   │   SERVERLESS PROXY MODE       │
│  (Local Dev / User API Key)   │                   │    (Production Deployment)    │
├───────────────────────────────┤                   ├───────────────────────────────┤
│ • Reads key from Storage /    │                   │ • Calls /api/gemini endpoint  │
│   import.meta.env             │                   │ • process.env.GEMINI_API_KEY  │
│ • Passes x-goog-api-key header│                   │ • Server-side rate limiter    │
│ • Calls Google Gemini directly│                   │ • Hides key 100% from browser │
└──────────────┬────────────────┘                   └───────────────┬───────────────┘
               │                                                    │
               └──────────────────────┬─────────────────────────────┘
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       GOOGLE GEMINI 2.5 FLASH API ENGINE        │
             │   Vision OCR • Podcast Gen • Multimodal Report  │
             │     Oral Viva Grading • Lateral Solutions       │
             └────────────────────────┬────────────────────────┘
                                      │ (If offline or no key)
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │            SMART DEMO FALLBACK SUITE            │
             │  Offline Lessons • Audio Dialogues • Rubrics    │
             └─────────────────────────────────────────────────┘
```

---

## 3. Global Systems & Ergonomic Controls

### 3.1 Anti-Burnout Pacer Engine
- **The Science:** Dyslexic readers experience optical fatigue and cognitive saturation within 20 minutes of continuous decoding.
- **The Implementation:** A smooth, calm, non-ticking progress bar spans the top of the header. It quietly monitors session focus minutes without anxiety-inducing digital clocks.
- **The Restorative Break:** At the 20-minute threshold, MindForge prompts a **2-Minute Anti-Burnout Brain Break**:
  - **3D Spatial Breathing Orb:** An expanding/contracting visual guide that guides the student through diaphragmatic breathing (*4s inhale, 4s hold, 4s exhale*).
  - **20-20-20 Rule Guidance:** Instructs the student to focus on an object 20 feet away for 20 seconds to relax ciliary eye muscles.
  - Automatically logs focus minutes and breaks taken into `StorageService`.

### 3.2 "My Brain Profile" Calibration Engine
Accessible via the **⚙️ My Brain Profile** button in the header, allowing students to calibrate their personal visual comfort settings:
1. **Scotopic Theme Overlays:**
   - **Warm Cream (`#FDFBF7`):** Neutralizes harsh blue-white glare.
   - **Soft Yellow (`#FEF9E7`):** Proven to calm visual dyslexia distortion.
   - **Cool Mint (`#F0FDF4`):** Reduces migraine and optical hyperactivity.
   - **Calm Sky (`#F0F9FF`):** Enhances reading contrast for astigmatic eyes.
   - **Dark Comfort (`#1E293B`):** Night-time low-luminescence mode.
2. **BDA Typography Calibration:**
   - **Font Switcher:** Toggle between **Lexend** (hyper-legible geometric font designed to prevent optical crowding) and **OpenDyslexic** (weighted bottom gravity preventing mental rotations).
   - **Dynamic Sliders:** Real-time controls for Font Size (16–26px), Letter Spacing (0.08–0.25em), Word Spacing (0.15–0.45em), and Line Height (1.5–2.4).
   - **Live Typography Preview Box:** Real-time rendering of test sentences as sliders move.
3. **API Key & Data Protection Manager:**
   - User-supplied Google Gemini key input with visibility toggle.
   - **🔒 Clear API Key & Wipe Local Data:** A one-click nuclear privacy button that purges `localStorage`, `sessionStorage`, and Service Worker caches with confirmation.

### 3.3 Quick Dyslexia Transformer Toolbar
Located directly under the navigation bar for instant 1-click toggling during reading:
- Quick theme swatch circles.
- Bionic reading switch.
- Syllable splitter switch.
- Focus reading ruler toggle.
- Font family toggle (`Lexend` &harr; `OpenDyslexic`).

---

## 4. Tab 1: Read & Absorb (The Shield)

Tab 1 is engineered to eliminate the friction of decoding curriculum text and academic materials.

### 4.1 BDA-Compliant Reader Canvas
- Enforces strict left alignment (`text-align: left`). Justified text is strictly prohibited to eliminate "rivers of white space" that disorient dyslexic eye tracking.
- Implements maximum line width of `65ch` so the eye does not get lost jumping between lines.
- Pure `#FFFFFF` and `#000000` are completely purged from the styling engine.

### 4.2 Bionic Reading Engine (`scripts/reader-tools.js`)
- Algorithmic text parser that identifies word boundaries and bolds the initial 40% of every word (`Pho` in *Photosynthesis*, `pro` in *process*).
- Serves as an optical anchor for the brain's saccadic eye movements, pulling the gaze forward before the eye can hesitate or invert characters.

### 4.3 Syllable Splitter (`scripts/reader-tools.js`)
- Scans words of 7 or more characters and checks them against common prefixes (`photo-`, `chlor-`, `inter-`, `trans-`) and suffixes (`-tion`, `-ment`, `-ology`, `-ness`).
- Inserts middle typographical dots (`·`) into long polysyllabic vocabulary (*Pho·to·syn·the·sis*, *En·vi·ron·ment*), reducing phonological decoding anxiety.

### 4.4 Focus Reading Ruler Overlay
- A cursor-tracking optical guide consisting of a semi-opaque top mask, a transparent highlighted reading bar, and a semi-opaque bottom mask.
- Follows the user's mouse pointer or touchscreen finger Y-coordinate with zero jitter, anchoring visual attention exclusively to the line currently being read.

### 4.5 Bimodal Audio Karaoke Engine (`scripts/speech-engine.js`)
- Utilizes browser-native `window.speechSynthesis`.
- **Word-Level Boundary Highlighting:** Hooks into the native speech engine's `onboundary` event to highlight the spoken word in bright yellow (`karaoke-word-active`) in real-time as the audio plays.
- Provides Play, Pause, Resume, Stop controls and speed chips (**0.75x Slow Comfort**, **1.0x Normal**, **1.25x Brisk**).

### 4.6 Tap-to-Hinglish Visual Dictionary
- Clicking or double-clicking any word in the reader opens a rich modal:
  - Large syllable chunks breakdown.
  - Emoji conceptual icon anchor.
  - Phonetic pronunciation guide (`/foh-toh-sin-thuh-sis/`).
  - **Aasan Hinglish Mein Matlab:** A simple, culturally relatable explanation in Hinglish.
  - Simple English definition and contextual example sentence.
  - **🔊 Hear Slow:** Pronounces the individual word at half speed (`0.6x`).

### 4.7 📷 Textbook Page Scanner (Gemini Vision OCR)
- Students upload a photo or page scan of their physical school textbook (JPEG, PNG, WebP up to 4MB).
- Gemini 2.5 Flash Vision extracts the academic text, strips away confusing typography, summarizes any diagrams/charts found on the page, and loads the cleaned lesson directly into the BDA Reader.
- Includes a built-in interactive demo sample (Class 9 Biology Chloroplast diagram).

### 4.8 🎤 Voice Topic Search
- Students tap the large microphone button and speak a curriculum topic in Hinglish or English (*"Photosynthesis kya hota hai?"* or *"Explain Ohm's Law"*).
- Gemini generates a complete, structured 4-paragraph lesson with bullet points, podcast dialogue, and flowchart syntax on the fly.

### 4.9 🎧 2-Person Hinglish Podcast Player
- Converts dry academic topics into an engaging, dramatized conversation between two relatable personas:
  - **👦 Aarav (Student):** Asks curious, intuitive questions in natural Hinglish.
  - **👩‍🏫 Riya (Mentor):** Explains scientific and historical mechanisms using everyday Indian physical analogies (cricket pitches, kitchen pressure cookers, water pipes).
- Uses dual-voice pitch modulation to create distinct audio voices. Clicking any dialogue bubble jumps the audio player to that exact line.
- Includes a **✨ AI Script** button to generate custom podcast dialogues for any textbook text.

### 4.10 🧠 1-Click Visual Flowchart (Mermaid.js)
- Converts lesson concepts into an interactive, spatial cause-and-effect flowchart using Mermaid.js syntax (`graph TD`).
- Nodes feature emoji visual labels and soft pastel color styles.
- Features interactive viewport controls: **Zoom In (`+`)**, **Zoom Out (`-`)**, **Reset Zoom**, and a **`</>` Code** toggle.

---

## 5. Tab 2: Think & Create Studio (The Sword)

Tab 2 is where the student transforms from a struggling reader into an engineering innovator.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        THINK & CREATE PIPELINE                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Tactile Canvas Sketch ]       +      [ Spoken Stream of Thought ]  │
│    (Draw components, arrows,               (Talk in natural Hinglish   │
│     circuits, water pipes)                  explaining the invention)  │
│                │                                      │                │
│                └──────────────────┬───────────────────┘                │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │   Gemini 2.5 Flash Multimodal     │                  │
│                 │   Spatial & Linguistic Synthesis  │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │    TOP-GRADE ACADEMIC ARTIFACT    │                  │
│                 ├───────────────────────────────────┤                  │
│                 │ • 1. Executive Summary            │                  │
│                 │ • 2. Engineering Mechanism        │                  │
│                 │ • 3. Scientific Principles        │                  │
│                 │ • 4. Environmental Impact         │                  │
│                 │ • 5. 3-5 Core Concept Bullets     │                  │
│                 │ • 6. Practical Upgrade Ideas      │                  │
│                 └───────────────────────────────────┘                  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Interactive HTML5 Canvas Whiteboard
- Responsive drawing canvas equipped with:
  - **Color Palette:** Indigo Blueprint, Amber Energy, Emerald Eco, Rose Alert, Slate Dark.
  - **Stroke Thickness:** Fine (2px), Medium (5px), Thick Marker (10px).
  - **Tools:** Freehand Pencil, Eraser, Geometric Rectangle, Geometric Circle, Connector Arrow.
  - **History & Canvas State:** Full Undo (`Ctrl+Z`) and 1-Click Canvas Wipe.

### 5.2 "Speak Idea While Sketching" Mic Stream
- Students activate the microphone while drawing. Using `webkitSpeechRecognition`, their spoken explanation is transcribed into an editable idea box in real time.
- Supports both English and conversational Hinglish.
- Includes a **Sample Idea** button (*Smart Rooftop Rainwater & Solar Micro-Harvester*) for testing without a microphone.

### 5.3 ✨ Turn Sketch + Voice into Masterpiece
- Exports the canvas drawing as a base64 PNG and bundles it with the transcribed spoken text.
- Gemini 2.5 Flash Multimodal analyzes both spatial geometry and verbal logic to produce:
  - **Structured Academic Submission:** Written in clean, publication-ready Markdown (Executive Summary, Mechanism, Principles, Impact, Conclusion).
  - **Key Conceptual Takeaways Grid:** 3 to 5 highlighted concept cards.
  - **Real-World Engineering Upgrades Grid:** Practical ideas to elevate the project (IoT sensors, float switches, moisture probes).

### 5.4 Export & Audio Tools
- **🔊 Read My Generated Essay:** High-fidelity TTS playback of the generated report.
- **📋 Copy Text:** One-click clipboard copy of the report, bullets, or upgrades.
- **💾 Save to Portfolio:** Stores the masterpiece in `localStorage` (`mindforge_saved_masterpieces`).

---

## 6. Tab 3: Brain Gym & Viva Arena (Oral Assessment & Spatial IQ)

Tab 3 shifts the testing paradigm away from written spelling exams to oral mastery and tactile spatial exercises.

### 6.1 🗣️ "Teach the AI" (Oral Viva Mode)
- **The Philosophy:** Dyslexic students frequently score 40% on written exams despite understanding 95% of the conceptual mechanics. In Oral Viva Mode, they prove mastery verbally.
- **Topics Selection:** Pre-loaded curriculum viva prompts (e.g. *Photosynthesis for a 10-Year-Old*, *Indus Valley Drainage Systems*, *Gravity & Planetary Orbits*, *Ohm's Law Water Pipe Analogy*).
- **The Evaluation Rubric (Gemini 2.5 Flash):**
  - **Zero Deductions** for spelling, grammar slips, stuttering, or colloquial Hinglish phrasing.
  - Evaluates **100% on conceptual understanding, cause-and-effect reasoning, and creative analogies**.
  - Generates a **Conceptual Score out of 10** (typically generous 8.5–10 for strong logic).
  - Outputs a **Strengths List** celebrating their insights, a warm **Friendly Hinglish Pro-Tip**, and enthusiastic **Spoken Audio Feedback** (*"Shaabaash! Aapka conceptual grasp zabardast hai..."*).

### 6.2 🧩 "Fix the Broken System" (Lateral Thinking Arena)
- **The Philosophy:** Dyslexic minds excel at seeing 3D physical blockages and designing creative passive fixes (Indian *Jugaad*).
- **Visual Engineering Puzzles:** Real-world problem scenarios presented with SVG schematics:
  - *The Jammed Grain Silo Gravity Chute:* Grain jamming at a sharp 90-degree bend.
  - *The Clogged Siphon Irrigation Canal:* Siphon tubes clogged by floating weed debris.
  - *Desert Solar Panel Dust Accumulator:* Fine dust blocking rooftop panels without water supply.
- **Superpower Badges:** Students speak their solution and unlock collectible trophies:
  - **3D Spatial Architect 🏆**
  - **Jugaad Systems Innovator 🛠️**
  - **Mechanical Systems Genius ⚙️**
  - **Interconnected Mind 🧠**

### 6.3 ✍️ Multisensory Sand & Glow Letter Tracer
- **The Problem:** Phonological dyslexia often leads to mirror confusion between letters **'b' vs 'd'** and **'p' vs 'q'**.
- **The "b-e-d Thumbs Trick":** An interactive visual guide demonstrating how thumbs up on both hands spell out the word **"b - e - d"** (Left hand forms 'b', right hand forms 'd'). Includes an audio pronunciation explanation.
- **Glowing Particle Sand Canvas:**
  - Tactile HTML5 canvas with a sand-dune aesthetic.
  - As the student traces with a mouse or finger, glowing golden particles emit along the stroke path with realistic physics and stroke fading.
  - Guides students with directional dashed lines and letter stencils.
  - Recites phonetic audio rhymes for each letter:
    - *'b': "Bat comes down, then around the ball!"*
    - *'d': "First draw the round doorknob, then the tall door!"*
    - *'p': "Draw the pencil down into the dirt, then make the popcorn pop!"*
    - *'q': "Draw the round queen face, then give her hair a little curl!"*
- **Trace Check & Sand Wipe:** Validates stroke completion with a celebration sound and a tactile sand-wipe particle clear.

### 6.4 🏆 Superpower Trophy Wall
- Displays all unlocked badges, viva scores, and traced letter mastery counts stored persistently in `StorageService`.

---

## 7. AI Integration & Dual Execution Paths

MindForge provides two execution modes to ensure it remains functional under all conditions:

### 7.1 Path A: Direct Client-Side API Mode (Local Dev & In-App Key)
- When a user enters their free Gemini API key in **My Brain Profile** or sets `VITE_GEMINI_API_KEY` in `.env`:
  - `scripts/gemini-service.js` makes direct HTTP POST requests to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`.
  - The API key is sent **strictly via the `x-goog-api-key` HTTP header** (never in URL query strings).
  - Rate-limited client-side to enforce a minimum 2-second cooldown between calls.

### 7.2 Path B: Production Serverless Proxy Mode (`api/gemini.js`)
- When deployed on platforms like Vercel:
  - The frontend probes `/api/gemini` via a GET health check on startup.
  - If active, all AI calls are routed through the backend proxy.
  - The API key (`process.env.GEMINI_API_KEY`) **never leaves the server** and is never exposed in browser developer tools or network logs.
  - Includes an in-memory sliding-window rate limiter (30 requests/minute per IP) to prevent proxy abuse.

### 7.3 Path C: Smart Offline Demo Mode (Zero Key Needed)
- If no API key is provided and the serverless proxy is unconfigured, MindForge **instantly falls back to rich built-in curriculum data** from `scripts/demo-data.js`:
  - Pre-computed textbook scans (Chloroplast structure).
  - Voice discovery lessons (Ohm's Law, Indus Valley Civilization).
  - Multimodal solar harvester project blueprints.
  - Complete viva rubrics and lateral thinking solutions.
  - **Zero crashes, zero errors, 100% functionality at ₹0 cost.**

---

## 8. Security Hardening & Privacy Architecture

MindForge is fortified against injection, data theft, and quota exhaustion:

| Security Vector | Implementation Detail |
| :--- | :--- |
| **API Key Protection** | Header-only authentication (`x-goog-api-key`). No `?key=` query parameters in URLs. Auto-redaction of key patterns from error logs. |
| **Content Security Policy (CSP)** | Strict `<meta http-equiv="Content-Security-Policy">` in `index.html` restricting scripts, fonts, styles, and connect origins to `'self'`, Google Fonts, jsDelivr, and Google Gemini API. |
| **XSS & DOM Sanitization** | All dynamic HTML interpolations (OCR text, user transcripts, AI reports) are sanitized via `escapeHtml()` with entity replacement (`&`, `<`, `>`, `"`, `'`). |
| **Mermaid Security** | Initialized with `securityLevel: 'strict'` to prevent malicious script execution inside flowchart diagram nodes. |
| **Upload Hardening** | `GeminiService.validateImageFile()` enforces a strict 4MB file size ceiling and whitelists MIME types exclusively to `image/jpeg`, `image/png`, and `image/webp`. |
| **Local Data Wipe** | `StorageService.wipeAllLocalData()` clears all `mindforge_*` keys, `sessionStorage`, and Service Worker cache entries in one action. |

---

## 9. Local Execution & Production Deployment

### 9.1 Running Locally
MindForge requires no complex build tools or `node_modules` to run. Any local HTTP server works:

```powershell
# Option 1: Python HTTP Server (Built-in)
python -m http.server 8080

# Option 2: Node.js npx serve
npx serve .

# Option 3: VS Code Live Server extension
# Click "Go Live" on index.html
```

Open `http://localhost:8080` in Chrome, Edge, or Brave.

### 9.2 Deploying to Production (Vercel)
The project includes [`vercel.json`](vercel.json) pre-configured with security headers:

```powershell
# Using Vercel CLI:
npx vercel
```
Or connect your GitHub repository to [Vercel](https://vercel.com) and set `GEMINI_API_KEY` in **Project Settings > Environment Variables**.

### 9.3 Installing as a Standalone App (PWA)
1. Open the website over `https://` (or `http://localhost:8080`).
2. Click the **Install MindForge** icon in your browser address bar.
3. MindForge now runs in an isolated, distraction-free native desktop/mobile window with offline caching.

---

## 📄 File Map

```text
dyslexia-app/
├── index.html               <- Main single-page web app with strict CSP & BDA layout
├── manifest.json            <- PWA manifest (name, colors, icons, display mode)
├── sw.js                    <- PWA Service Worker for offline asset caching
├── vercel.json              <- Vercel deployment config with security HTTP headers
├── .env                     <- Local environment variables (ignored by Git)
├── .env.example             <- Safe template for team members
├── .gitignore               <- Excludes secrets, node_modules, build outputs, and logs
├── README.md                <- Quick-start guide and key setup instructions
├── PLAN.md                  <- 7-phase master execution plan & directives
├── FEATURES_AND_WORKINGS.md <- (This file) Complete technical & feature documentation
├── PRESENTATION_SCRIPT.md   <- 5-presenter pitch script with timings and Q&A battlecard
├── presentation.html        <- 18-slide interactive pitch deck web application
├── video-explainer.html     <- 5-minute 1080p explainer video player & MP4 recorder
├── VIDEO_SCRIPT_AND_CHAPTERS.md <- Complete 5-minute timeline and narration script
├── api/
│   └── gemini.js            <- Production serverless proxy for Google Gemini API
├── styles/
│   └── dyslexia-theme.css   <- BDA typography, scotopic themes, and layout rules
└── scripts/
    ├── app.js               <- App orchestrator, modal controllers, and event router
    ├── storage.js           <- Brain profile settings, stats, and local wipe engine
    ├── gemini-service.js    <- Secure Gemini 2.5 Flash API client & rate limiter
    ├── reader-tools.js      <- Bionic reading, syllable splitter, ruler, and dictionary
    ├── speech-engine.js     <- Web Speech API engine (TTS karaoke & speech recognition)
    ├── creative-studio.js   <- HTML5 canvas whiteboard & sketch-to-essay synthesis
    ├── brain-gym.js         <- Oral viva examiner, lateral arena & sand tracer
    └── demo-data.js         <- Offline curriculum lessons, podcasts, and rubrics
```

---
*Built with ❤️ for neurodivergent minds everywhere. Designed to the standards of the British Dyslexia Association.*
