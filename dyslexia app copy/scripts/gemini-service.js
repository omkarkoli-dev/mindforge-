/**
 * MINDFORGE - Gemini Service (Free Gemini 2.5 Flash API Wrapper)
 * Implements:
 * 1. callGeminiAPI: Standard REST fetch for gemini-2.5-flash with multimodal base64 support
 * 2. scanTextbookPage: Gemini Vision OCR to extract clean text + diagram summary
 * 3. searchTopicVoice: Voice topic lesson generator with smart fallback
 * 4. generatePodcast: 2-Host Hinglish conversation generator between Aarav & Riya
 * 5. generateFlowchart: 1-Click Mermaid.js (graph TD) visual diagram generator
 * 6. Automatic seamless fallback to scripts/demo-data.js when no API key is set or on network limits
 */

(function (window) {
  'use strict';

  const GEMINI_MODEL = 'gemini-2.5-flash';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  // Enforce minimum 2-second rate limit cooldown between Gemini requests
  let lastCallTimestamp = 0;
  const MIN_COOLDOWN_MS = 2000;

  async function enforceApiCooldown() {
    const now = Date.now();
    const elapsed = now - lastCallTimestamp;
    if (elapsed < MIN_COOLDOWN_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_COOLDOWN_MS - elapsed));
    }
    lastCallTimestamp = Date.now();
  }

  const GeminiService = {
    hasBackendProxy: false,

    /**
     * Check if backend serverless proxy (/api/gemini) is deployed & configured
     */
    checkBackendProxy: async function () {
      try {
        const res = await fetch('/api/gemini', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          this.hasBackendProxy = Boolean(data && data.status === 'ready' && data.configured);
          return this.hasBackendProxy;
        }
      } catch (e) {
        this.hasBackendProxy = false;
      }
      return false;
    },

    /**
     * Check if user has entered an API key or backend proxy is available
     */
    isConfigured: function () {
      return Boolean(this.getApiKey() || this.hasBackendProxy);
    },

    /**
     * Get stored API key from StorageService or Vite/environment fallback
     * Note: Never logs key or leaks it in URLs
     */
    getApiKey: function () {
      let key = '';
      if (window.StorageService) {
        key = window.StorageService.getApiKey() || '';
      }
      if (!key) {
        try {
          if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.VITE_GEMINI_API_KEY) {
            const envKey = window.__ENV__.VITE_GEMINI_API_KEY.trim();
            if (envKey && envKey !== 'your_gemini_api_key_here') {
              key = envKey;
            }
          } else if (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
            const envKey = process.env.VITE_GEMINI_API_KEY.trim();
            if (envKey && envKey !== 'your_gemini_api_key_here') {
              key = envKey;
            }
          }
        } catch (e) {
          // Ignore environment check errors
        }
      }
      return key ? key.trim() : '';
    },

    /**
     * Strict image file validation (JPEG, PNG, WebP under 4MB)
     * @param {File} file
     * @returns {{ valid: boolean, error: string|null }}
     */
    validateImageFile: function (file) {
      if (!file) {
        return { valid: false, error: 'No file selected.' };
      }
      const maxBytes = 4 * 1024 * 1024; // 4MB
      if (file.size > maxBytes) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          valid: false,
          error: `File size (${sizeMb} MB) exceeds the 4 MB limit. Please select a smaller image.`
        };
      }
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.type)) {
        return {
          valid: false,
          error: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.'
        };
      }
      const fileName = (file.name || '').toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExt) {
        return {
          valid: false,
          error: 'Invalid file extension. Please select a valid .jpg, .png, or .webp file.'
        };
      }
      return { valid: true, error: null };
    },

    /**
     * Core Gemini API wrapper for gemini-2.5-flash
     * Supports serverless backend proxy (/api/gemini) or direct call with x-goog-api-key header
     * @param {string} promptText - Text instruction
     * @param {string|null} base64Image - Optional base64 data URL or pure base64 string
     * @param {string} mimeType - Image mime type, default 'image/png'
     * @returns {Promise<string>}
     */
    callGeminiAPI: async function (promptText, base64Image = null, mimeType = 'image/png') {
      await enforceApiCooldown();

      const apiKey = this.getApiKey();

      // Path A: Check if backend serverless proxy (/api/gemini) is available when no client key is set
      if (!apiKey) {
        try {
          const proxyRes = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: promptText,
              base64Image: base64Image,
              mimeType: mimeType,
              model: GEMINI_MODEL
            })
          });

          if (proxyRes.ok) {
            const proxyData = await proxyRes.json();
            if (proxyData && proxyData.reply) {
              return proxyData.reply;
            }
          }
        } catch (proxyErr) {
          // Serverless proxy not deployed/running; fall through to demo mode
        }

        throw new Error('DEMO_MODE');
      }

      // Path B: Direct Google Gemini API call with secure x-goog-api-key header
      const parts = [{ text: promptText }];

      if (base64Image) {
        // Strip out data URL prefix if present (e.g. data:image/png;base64,...)
        const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: cleanBase64
          }
        });
      }

      const requestBody = {
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048
        }
      };

      // SECURITY CRITICAL: Never pass API key as ?key= in the URL. Use x-goog-api-key header!
      const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const rawErr = await response.text();
        // Redact any potential API key tokens from the error message for privacy
        const sanitizedErr = rawErr.replace(/[A-Za-z0-9_-]{39}/g, '[REDACTED_KEY]');
        throw new Error(`Gemini API Error (${response.status}): ${sanitizedErr}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const reply = candidate?.content?.parts?.[0]?.text || '';
      return reply;
    },

    /**
     * 1. 📷 TEXTBOOK PAGE SCANNER (Gemini Vision OCR)
     * Extracts clean, dyslexic-friendly text + diagram summary from an image
     * @param {string} base64Image - Data URL or base64 string of textbook photo
     * @param {string} mimeType - e.g. 'image/jpeg' or 'image/png'
     * @returns {Promise<Object>} Cleaned lesson object
     */
    scanTextbookPage: async function (base64Image, mimeType = 'image/jpeg') {
      if (this.isConfigured() && base64Image) {
        try {
          const prompt = `You are MindForge, an assistive AI specialized in adapting textbook pages for students with Dyslexia.
Analyze this textbook page image:
1. Extract all academic text accurately, but reformat it into clean, short paragraphs (avoiding dense intimidating walls of text).
2. If the page contains any diagrams, illustrations, charts, or maps, identify and describe them clearly in a short diagram note.
3. Formulate 3 key takeaway bullet points.
4. Create a 4-turn Hinglish audio discussion between "Aarav" (curious student) and "Riya" (mentor) explaining the page with a relatable everyday analogy.
5. Provide a simple Mermaid.js flowchart (graph TD) connecting 4-5 core nodes of this page.

Return your response in STRICT JSON format with this exact structure:
{
  "title": "Title of the textbook topic",
  "category": "Subject category (e.g. Biology, History, Physics)",
  "summary": "1-2 sentence high-level summary",
  "content": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3",
  "diagramNote": "Description of the visual diagram on this page (or leave empty if no diagram)",
  "keyPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ],
  "podcast": [
    { "speaker": "Aarav", "avatar": "👦", "text": "Hinglish question about this topic..." },
    { "speaker": "Riya", "avatar": "👩‍🏫", "text": "Hinglish explanation with desi analogy..." }
  ],
  "mermaid": "graph TD\\n    A[Node 1] --> B[Node 2]\\n    B --> C[Node 3]"
}
Output ONLY valid JSON without extra markdown fences.`;

          const raw = await this.callGeminiAPI(prompt, base64Image, mimeType);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              source: 'gemini',
              id: 'scan_' + Date.now(),
              title: parsed.title || 'Scanned Textbook Page',
              category: parsed.category || 'Textbook Scan (Vision OCR)',
              summary: parsed.summary || 'Extracted page content optimized for dyslexia reading.',
              readingTime: '2 min read',
              content: parsed.content || 'No text extracted.',
              diagramNote: parsed.diagramNote || '',
              keyPoints: parsed.keyPoints || [
                'Extracted from textbook image using Gemini 2.5 Flash Vision.',
                'Reformatted with wide line height and clean paragraph breaks.',
                'Diagram visual structure summarized for spatial learners.'
              ],
              podcast: parsed.podcast || (window.DemoData?.lessons?.photosynthesis?.podcast || []),
              mermaid: parsed.mermaid || (window.DemoData?.lessons?.photosynthesis?.mermaid || '')
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Vision OCR API call failed, falling back to demo scan:', err);
        }
      }

      // Automatic Fallback Demo Payload:
      // Realistic biology textbook page scan with chloroplast diagram explanation
      return {
        source: 'demo',
        id: 'scan_demo_chloroplast',
        title: '📷 Scanned: Plant Cell Chloroplasts & Thylakoid Grana',
        category: 'Biology (Class 9 Textbook Scan)',
        summary: 'Extracted textbook page explaining microscopic chloroplast structure, chlorophyll thylakoids, and light energy capture.',
        readingTime: '3 min read',
        content: `Plant cells possess specialized double-membrane organelles called chloroplasts. These oval structures measure approximately five to ten micrometers across and float within the cellular cytoplasm.

Inside each chloroplast sits a fluid-filled matrix called the stroma. Suspended throughout this stroma are stacks of flattened disc-like sacs called thylakoids. When grouped together into compact stacks, they resemble piles of green coins known as grana.

Embedded directly inside the thylakoid membranes are millions of green chlorophyll molecules. When light photons hit these molecules, electrons become energized and initiate the light-dependent reactions of photosynthesis.

Water absorbed from the soil is split into hydrogen ions and oxygen gas. The released oxygen diffuses out through stomatal pores into our atmosphere, while hydrogen fuels the synthesis of glucose.`,
        diagramNote: '📊 Diagram Identified: Fig 6.4 Cross-section of a Chloroplast showing outer membrane, inner membrane, stroma fluid, and stacked grana thylakoids absorbing photons.',
        keyPoints: [
          '🌿 Chloroplasts contain stacks of thylakoid discs called grana.',
          '☀️ Light photons energize chlorophyll electrons within thylakoid membranes.',
          '💧 Water splitting releases oxygen gas through leaf stomata.'
        ],
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Riya didi, textbook ke is diagram mein green coin jaise stacks dikh rahe hain, yeh kya hain?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Aarav! Inhe Thylakoids kehte hain. Jab yeh ek ke upar ek sikke ki tarah jam jaate hain, toh pure stack ko Grana bolte hain.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur inka kaam kya hota hai? Sirf sajawat ke liye hain?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Bilkul nahi! Yehi to asli solar panels hain! Inki chhat par Chlorophyll molecules hote hain jo suraj ki dhoop (photons) ko pakadte hain aur paani ko split karke oxygen banate hain!'
          }
        ],
        mermaid: `graph TD
    A["☀️ Sunlight Photons"] --> B["🟢 Thylakoid Membrane (Grana)"]
    C["💧 Water (H2O) from Roots"] --> B
    B --> D["⚡ Excited Electrons"]
    B --> E["🫧 Oxygen Released (O2)"]
    D --> F["🍬 Glucose Synthesis in Stroma"]
    classDef sun fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef thyla fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    classDef prod fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    class A sun;
    class B thyla;
    class C,D,E,F prod;`
      };
    },

    /**
     * 2. 🎤 VOICE TOPIC SEARCH (Spoken Query to Full Lesson)
     * @param {string} queryText - Spoken voice query
     * @returns {Promise<Object>}
     */
    searchTopicVoice: async function (queryText) {
      const cleanQuery = (queryText || '').trim();

      if (this.isConfigured() && cleanQuery) {
        try {
          const prompt = `You are MindForge, generating a dyslexia-friendly lesson for a student who searched for: "${cleanQuery}".
Guidelines:
1. Explain the topic using vivid, concrete physical analogies (water pipes, kitchens, bicycles, dominoes).
2. Write exactly 3 to 4 short paragraphs.
3. Provide 3 crisp bullet points.
4. Provide a 6-turn Hinglish podcast dialogue between "Aarav" (curious student) and "Riya" (mentor).
5. Provide valid Mermaid.js "graph TD" flowchart syntax (4-5 nodes, emoji labels, pastel colors).

Output STRICT JSON:
{
  "title": "Title of Topic",
  "category": "Subject Category",
  "summary": "1-2 sentence clear summary",
  "content": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "podcast": [
    { "speaker": "Aarav", "avatar": "👦", "text": "..." },
    { "speaker": "Riya", "avatar": "👩‍🏫", "text": "..." }
  ],
  "mermaid": "graph TD\\n    A[Node 1] --> B[Node 2]"
}
Output ONLY valid JSON.`;

          const raw = await this.callGeminiAPI(prompt);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              source: 'gemini',
              id: 'voice_' + Date.now(),
              title: parsed.title || cleanQuery,
              category: parsed.category || 'Voice Search Discovery',
              summary: parsed.summary || 'Dyslexia-adapted lesson generated from your voice query.',
              readingTime: '2 min read',
              content: parsed.content || '',
              keyPoints: parsed.keyPoints || [],
              podcast: parsed.podcast || [],
              mermaid: parsed.mermaid || ''
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Voice topic Gemini API call failed, falling back to smart demo:', err);
        }
      }

      // Smart Fallback Matching against pre-loaded lessons or Ohm's Law demo
      const q = cleanQuery.toLowerCase();
      const lessons = window.DemoData?.lessons || {};

      if (q.includes('photo') || q.includes('plant') || q.includes('leaf') || q.includes('food') || q.includes('patti')) {
        return { ...lessons.photosynthesis, source: 'demo' };
      }
      if (q.includes('indus') || q.includes('harappa') || q.includes('history') || q.includes('drain') || q.includes('civil')) {
        return { ...lessons.indus_valley, source: 'demo' };
      }
      if (q.includes('gravit') || q.includes('orbit') || q.includes('moon') || q.includes('space') || q.includes('physics')) {
        return { ...lessons.gravity_orbits, source: 'demo' };
      }
      if (q.includes('ram') || q.includes('memory') || q.includes('computer') || q.includes('hardware') || q.includes('dimm') || q.includes('sram') || q.includes('dram') || q.includes('terna')) {
        if (lessons.ram_memory) {
          return { ...lessons.ram_memory, source: 'demo' };
        }
      }
      if (q.includes('ohm') || q.includes('volt') || q.includes('current') || q.includes('resistan') || q.includes('circuit')) {
        if (lessons.ohms_law) {
          return { ...lessons.ohms_law, source: 'demo' };
        }
      }

      // Default Dynamic Voice Demo: Ohm's Law & Electricity
      return {
        source: 'demo',
        id: 'voice_ohms_law',
        title: `⚡ Ohm's Law & Electricity: The Water Pipe Secret`,
        category: 'Practical Physics & Electricity',
        summary: 'How Voltage pushes Electric Current through Resistance, explained through an everyday water pipe analogy.',
        readingTime: '3 min read',
        content: `Have you ever wondered how electricity flows through wires to turn on lamps, run fans, and charge your phone?

Think of electricity like water flowing through a garden pipe. Voltage is the water pressure pushing from an overhead tank. Current is the actual amount of water flowing past each second. Resistance is a narrow squeeze in the pipe that tries to slow the water down.

In 1827, German physicist Georg Ohm discovered that electric current is directly proportional to voltage and inversely proportional to resistance. This gives us the famous formula: Voltage = Current × Resistance, or V = I × R.

When you turn the volume dial on a music player or use a dimmer switch for bedroom lights, you are simply turning a variable resistor to safely control the amount of flowing current!`,
        keyPoints: [
          '💧 Water Pipe Analogy: Voltage is water pressure, Current is flow volume, Resistance is narrow friction.',
          '📐 The Ohm Formula: V = I × R connects electrical push, flow rate, and opposition.',
          '🎛️ Real-World Use: Volume dials and fan regulators work by adjusting internal resistance.'
        ],
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Didi, yeh Voltage aur Current mein difference kya hai? Log dono ko bijli hi bolte hain!'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Arre Aarav, sabse easy example paani ki pipe ka hai! Voltage matlab tanki ka paani ka pressure, jo dhakka maarta hai.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Acha! Toh Current kya hua fir?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Current hai pipe se nikalne wala paani ka actual bahaav! Aur Resistance hai pipe ke andar ki rukawat ya squeeze.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Arre waah! Matlab jitna zyada Voltage ka pressure hoga, utna tezi se Current daudega!'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Shaabaash! Isi ko hum kehte hain Ohm’s Law: V = I × R. Formula yaad rakhna ab kitna simple ho gaya!'
          }
        ],
        mermaid: `graph TD
    A["🔋 Voltage Push (V)"] --> C["⚡ Electric Current (I)"]
    B["🚧 Resistance Obstacle (R)"] -. slows down .-> C
    C --> D["💡 Glowing Light Bulb"]
    classDef volt fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef curr fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef res fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef light fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    class A volt;
    class B res;
    class C curr;
    class D light;`
      };
    },

    /**
     * 3. 🎧 2-HOST HINGLISH PODCAST GENERATOR
     * Generates a 6-8 turn dialogue between Aarav & Riya for any given text
     * @param {string} lessonText 
     * @param {string} lessonTitle 
     * @returns {Promise<Object>}
     */
    generatePodcast: async function (lessonText, lessonTitle) {
      if (this.isConfigured() && lessonText) {
        try {
          const prompt = `You are a scriptwriter for MindForge, an assistive platform for dyslexic Indian students.
Write an engaging 6 to 8 turn conversational podcast script in natural Hinglish explaining this topic:
Topic: "${lessonTitle}"
Lesson Content:
${lessonText.slice(0, 1500)}

Characters:
- "Aarav" (avatar 👦): An inquisitive student asking smart, relatable questions in natural Hinglish.
- "Riya" (avatar 👩‍🏫): A friendly mentor who explains concepts using simple Indian everyday analogies (cricket, kitchen, chai, bicycles, traffic).

Output STRICT JSON:
[
  { "speaker": "Aarav", "avatar": "👦", "text": "..." },
  { "speaker": "Riya", "avatar": "👩‍🏫", "text": "..." }
]
Output ONLY the JSON array.`;

          const raw = await this.callGeminiAPI(prompt);
          const jsonMatch = raw.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const dialogue = JSON.parse(jsonMatch[0]);
            return {
              source: 'gemini',
              podcast: dialogue
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Custom podcast generation failed, using demo fallback:', err);
        }
      }

      // Demo fallback
      const activeLesson = window.DemoData?.lessons?.photosynthesis;
      return {
        source: 'demo',
        podcast: activeLesson?.podcast || []
      };
    },

    /**
     * 4. 🧠 1-CLICK VISUAL FLOWCHART GENERATOR (Mermaid.js graph TD)
     * @param {string} lessonText 
     * @param {string} lessonTitle 
     * @returns {Promise<Object>}
     */
    generateFlowchart: async function (lessonText, lessonTitle) {
      if (this.isConfigured() && lessonText) {
        try {
          const prompt = `Convert this lesson into valid Mermaid.js flowchart syntax (graph TD) for dyslexic visual learners.
Topic: "${lessonTitle}"
Lesson Content:
${lessonText.slice(0, 1500)}

Rules:
1. First line MUST be "graph TD".
2. Create 4 to 6 sequential or cause-and-effect nodes with emoji icons in double quotes, e.g. A["☀️ Sunlight Energy"] --> B["🌿 Chloroplast"].
3. Apply soft pastel classDef styles so nodes are easy on dyslexic eyes (no pure black/pure white).
4. Do NOT output any markdown fences, backticks, or explanation. Output ONLY the raw Mermaid syntax.`;

          const raw = await this.callGeminiAPI(prompt);
          let cleanSyntax = raw.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
          if (cleanSyntax.includes('graph TD') || cleanSyntax.includes('flowchart TD')) {
            return {
              source: 'gemini',
              mermaid: cleanSyntax
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Custom Mermaid generation failed, using demo fallback:', err);
        }
      }

      // Demo fallback
      return {
        source: 'demo',
        mermaid: window.DemoData?.lessons?.photosynthesis?.mermaid || `graph TD
    A["☀️ Sunlight Energy"] --> D["🌿 Chloroplast & Chlorophyll"]
    B["💧 Water (H2O from Roots)"] --> D
    C["💨 Carbon Dioxide (CO2 from Air)"] --> D
    D --> E["🍬 Glucose (Plant Energy)"]
    D --> F["🫧 Pure Oxygen (O2 for Us)"]
    classDef sun fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef input fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef plant fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    classDef product fill:#EDE9FE,stroke:#7C3AED,stroke-width:2px,color:#4C1D95;
    class A sun;
    class B,C input;
    class D plant;
    class E,F product;`
      };
    },

    /**
     * 5. ✨ TURN SKETCH + VOICE INTO MASTERPIECE (Gemini 2.5 Flash Multimodal)
     * Synthesizes whiteboard sketch drawing + spoken transcript into an academic essay / project report
     * @param {string} base64CanvasImage - canvas.toDataURL('image/png')
     * @param {string} spokenTranscript - Spoken thoughts or idea notes
     * @returns {Promise<Object>}
     */
    generateSketchMasterpiece: async function (base64CanvasImage, spokenTranscript) {
      if (this.isConfigured() && (base64CanvasImage || spokenTranscript)) {
        try {
          const prompt = `You are MindForge's "Think & Create" AI Studio, an assistive platform empowering students with dyslexia by turning visual sketches and spoken ideas into top-tier academic projects.

Student Spoken Idea:
"${spokenTranscript || 'Student has drawn a mechanical or scientific diagram on the canvas whiteboard.'}"

Analyze the provided sketch image and the student's spoken thoughts. Dyslexic students excel at 3D spatial visualization, interconnected systems, and narrative problem-solving.
Synthesize their idea into a structured academic submission with:
1. Title: An inspiring engineering or academic project title.
2. Academic Report (generatedReport): High-grade, cleanly structured report with these markdown sections:
   - ### 1. Executive Summary
   - ### 2. Functional Engineering Components & Mechanism
   - ### 3. Scientific Principles Demonstrated
   - ### 4. Environmental & Societal Impact
   - ### 5. Conclusion
3. Key Conceptual Bullet Points (bulletSummary): 3-5 crisp bullet points highlighting the core concepts.
4. Real-World Engineering Upgrade Ideas (upgradeIdeas): 2-3 innovative, practical ideas to elevate this project even further (e.g. IoT sensors, materials, smart automation).

Return your response in STRICT JSON format with this exact structure:
{
  "title": "Title of the Project",
  "generatedReport": "Markdown string of the full report...",
  "bulletSummary": [
    "Key bullet point 1",
    "Key bullet point 2",
    "Key bullet point 3"
  ],
  "upgradeIdeas": [
    "Upgrade idea 1",
    "Upgrade idea 2"
  ]
}
Do NOT include markdown fences around the JSON. Output only valid JSON.`;

          const raw = await this.callGeminiAPI(prompt, base64CanvasImage, 'image/png');
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.generatedReport && parsed.bulletSummary) {
              return {
                source: 'gemini',
                title: parsed.title || 'Innovative Engineering Project Report',
                generatedReport: parsed.generatedReport,
                bulletSummary: Array.isArray(parsed.bulletSummary) ? parsed.bulletSummary : [parsed.bulletSummary],
                upgradeIdeas: Array.isArray(parsed.upgradeIdeas) ? parsed.upgradeIdeas : [parsed.upgradeIdeas]
              };
            }
          }
        } catch (err) {
          console.warn('[GeminiService] Custom sketch masterpiece failed, falling back to demo data:', err);
        }
      }

      // Demo fallback
      const demo = window.DemoData?.demoSketchMasterpiece || {
        title: 'Smart Rooftop Rainwater & Solar Micro-Harvester',
        studentVoicePrompt: 'Yahan upar ek curved solar panel roof hai jo rainwater ko collect karke ek sand-gravel filter pipe mein bhejta hai. Solar battery se ek automatic 12V pump chalta hai jo filtered paani ko terrace kitchen garden mein bhejta hai.',
        generatedReport: `### Project Blueprint: Integrated Solar-Powered Rainwater Filtration System

#### 1. Executive Summary
This student-designed green architecture innovation integrates photovoltaic solar energy with passive rooftop rainwater harvesting. By combining angled solar panels as both energy generators and water catchment canopies, the system eliminates reliance on external municipal electricity while conserving thousands of liters of rainwater every monsoon.

#### 2. Functional Engineering Components
- **Catchment Surface:** Angled hydrophobic solar panels dual-functioning as water diverters.
- **Sediment Pre-Filter:** Multilayer chamber utilizing coarse sand, crushed charcoal, and gravel to filter physical contaminants before storage.
- **Solar DC Pumping Circuit:** 12-Volt submersible pump driven directly by stored solar battery reserves, automatically irrigating terrace vegetation.

#### 3. Environmental Impact
Reduces municipal water dependence by up to 45% during monsoon months while maintaining zero net carbon footprint.`,
        bulletSummary: [
          'Dual-purpose canopy: Solar capture + rainwater deflection in a single surface.',
          'Passive sand-charcoal filtration cleans water before entering reservoir.',
          'Zero grid reliance: 12V direct-current pump powered entirely by stored sunshine.'
        ],
        upgradeIdeas: [
          'Add a simple float switch so the pump automatically rests when the water tank reaches minimum threshold.',
          'Implement an Arduino moisture sensor in the garden soil to prevent overwatering on humid days.'
        ]
      };

      return {
        source: 'demo',
        ...demo
      };
    },

    /**
     * 6. 🗣️ "TEACH THE AI" ORAL VIVA EVALUATION (Gemini 2.5 Flash)
     * Evaluates ONLY conceptual understanding and creative analogies.
     * NEVER deducts points for spelling, grammar, or accent.
     * @param {Object} topicObj - { id, title, prompt, category }
     * @param {string} studentSpeech - Transcribed spoken explanation
     * @returns {Promise<Object>} { score, strengths, missingPiece, audioFeedback }
     */
    evaluateOralViva: async function (topicObj, studentSpeech) {
      if (this.isConfigured() && studentSpeech && studentSpeech.trim().length > 5) {
        try {
          const prompt = `You are MindForge's Oral Viva Examiner, an assistive AI designed for students with dyslexia.
The student was asked to explain this topic like they are teaching a 10-year-old:
Topic: "${topicObj.title || 'Science / History Concept'}"
Prompt Given: "${topicObj.prompt || ''}"

Student's Spoken Explanation (Hinglish or English):
"${studentSpeech}"

CRITICAL DYSLEXIC-AWARE EVALUATION DIRECTIVES:
1. Evaluate ONLY conceptual understanding, cause-and-effect reasoning, and creative everyday analogies.
2. NEVER deduct points for spelling mistakes, grammatical slips, stuttering, or colloquial Hinglish syntax. Dyslexic minds excel at oral concepts—celebrate that!
3. Score is out of 10 (decimal allowed, e.g. 9.5 or 10.0). Give generous high marks (8.5 to 10) if the core concept is understood!
4. Provide 2-3 specific "strengths": bullet points celebrating their analogies, insights, and logic.
5. Provide 1 "missingPiece": a warm, friendly Hinglish tip or bonus fact that completes the picture.
6. Provide "audioFeedback": an enthusiastic 1-2 sentence spoken feedback in friendly Hinglish (starting with "Shaabaash!" or "Zabardast!").

Return STRICT JSON format:
{
  "score": 10,
  "strengths": [
    "Celebrated analogy or concept point 1",
    "Celebrated point 2"
  ],
  "missingPiece": "Friendly Hinglish tip for bonus knowledge...",
  "audioFeedback": "Shaabaash! Aapne concept ko bilkul crystal clear samjhaya..."
}
Output ONLY valid JSON, no markdown fences.`;

          const raw = await this.callGeminiAPI(prompt);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              source: 'gemini',
              score: typeof parsed.score === 'number' ? parsed.score : 9.5,
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [parsed.strengths],
              missingPiece: parsed.missingPiece || 'Remember to connect this with real-world examples!',
              audioFeedback: parsed.audioFeedback || 'Shaabaash! Aapka conceptual understanding bohot strong hai.'
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Live viva evaluation failed, using demo fallback:', err);
        }
      }

      // Offline Demo Fallback
      const demoTopic = (window.DemoData?.vivaTopics || []).find(t => t.id === topicObj.id || (topicObj.title && t.title.includes(topicObj.title)));
      if (demoTopic && demoTopic.evaluation) {
        return {
          source: 'demo',
          ...demoTopic.evaluation
        };
      }

      // Generic smart fallback
      return {
        source: 'demo',
        score: 10,
        strengths: [
          'Excellent intuitive grasp of the core mechanism and big picture.',
          'Explained ideas naturally using spoken analogies without getting tripped up by written spelling.',
          'Clear cause-and-effect storytelling that connects parts together.'
        ],
        missingPiece: 'You can also connect this to an everyday kitchen or household machine to make the explanation even more memorable!',
        audioFeedback: 'Shaabaash! Aapne concept ko bilkul crystal clear samjhaya. 10 mein se 10 marks for pure conceptual understanding!'
      };
    },

    /**
     * 7. 🧩 "FIX THE BROKEN SYSTEM" LATERAL THINKING EVALUATION
     * Evaluates out-of-the-box spatial and mechanical ingenuity (Jugaad).
     * @param {Object} challengeObj - { id, title, scenario, challenge, badgeAwarded }
     * @param {string} studentSolution - Spoken solution
     * @returns {Promise<Object>}
     */
    evaluateLateralChallenge: async function (challengeObj, studentSolution) {
      if (this.isConfigured() && studentSolution && studentSolution.trim().length > 5) {
        try {
          const prompt = `You are MindForge's Lateral Thinking Arena, celebrating the visual-spatial and inventive genius of dyslexic minds.
Engineering Challenge: "${challengeObj.title}"
Scenario: "${challengeObj.scenario}"
Problem: "${challengeObj.challenge}"

Student's Proposed Solution:
"${studentSolution}"

Evaluate their solution:
1. Celebrate practical passive engineering (Jugaad), spatial orientation, and simplicity.
2. Select the most fitting Dyslexic Advantage Superpower Badge:
   - "3D Spatial Architect 🏆"
   - "Jugaad Systems Innovator 🛠️"
   - "Mechanical Systems Genius ⚙️"
   - "Interconnected Mind 🧠"
3. Explain in 2-3 sentences "whyItWorks": the real-world physics/mechanics of their solution.
4. Provide an inspiring 1-2 sentence spoken "audioFeedback" in Hinglish.

Return STRICT JSON format:
{
  "badgeAwarded": "3D Spatial Architect 🏆",
  "ingenuityScore": "10/10",
  "whyItWorks": "Explanation of mechanical or spatial reason why this works...",
  "audioFeedback": "Zabardast! Aapka spatial engineering solution sach mein out-of-the-box hai."
}
Output ONLY valid JSON, no markdown fences.`;

          const raw = await this.callGeminiAPI(prompt);
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              source: 'gemini',
              badgeAwarded: parsed.badgeAwarded || challengeObj.badgeAwarded || '3D Spatial Architect 🏆',
              ingenuityScore: parsed.ingenuityScore || '10/10',
              whyItWorks: parsed.whyItWorks || 'Leverages passive geometry and spatial orientation to solve the blockage effortlessly.',
              audioFeedback: parsed.audioFeedback || 'Zabardast! Aapka spatial engineering solution sach mein out-of-the-box hai.'
            };
          }
        } catch (err) {
          console.warn('[GeminiService] Lateral thinking evaluation failed, using demo fallback:', err);
        }
      }

      // Offline Demo Fallback
      const demoChallenge = (window.DemoData?.lateralChallenges || []).find(c => c.id === challengeObj.id);
      return {
        source: 'demo',
        badgeAwarded: demoChallenge?.badgeAwarded || challengeObj.badgeAwarded || '3D Spatial Architect 🏆',
        ingenuityScore: '10/10',
        whyItWorks: demoChallenge?.demoSolution 
          ? `Brilliant passive design: ${demoChallenge.demoSolution}`
          : 'Brilliant passive design! By rethinking 3D geometry rather than adding costly motors, water flows freely while debris is diverted.',
        audioFeedback: 'Kamaal kar diya! Aapka lateral thinking aur spatial visualization bilkul top notch hai. Superpower badge unlocked!'
      };
    }
  };

  // Expose globally
  window.GeminiService = GeminiService;

  // Asynchronously probe backend serverless proxy on startup
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        GeminiService.checkBackendProxy().then(ready => {
          if (ready) {
            window.dispatchEvent(new CustomEvent('geminiKeyUpdated', { detail: { hasKey: true, proxy: true } }));
          }
        });
      });
    } else {
      GeminiService.checkBackendProxy().then(ready => {
        if (ready) {
          window.dispatchEvent(new CustomEvent('geminiKeyUpdated', { detail: { hasKey: true, proxy: true } }));
        }
      });
    }
  }

})(window);
