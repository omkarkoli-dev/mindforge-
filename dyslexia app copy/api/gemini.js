/**
 * MINDFORGE - Secure Vercel Serverless Function
 * Endpoint: /api/gemini
 * 
 * Secure proxy to Google Gemini API:
 * - Reads GEMINI_API_KEY from environment variables (process.env.GEMINI_API_KEY)
 * - Uses x-goog-api-key HTTP header (never exposes keys in URL parameters or frontend bundles)
 * - Request validation, size bounds, and server-side rate-limiting
 * - Safe error responses (never leaks keys or stack traces)
 */

// In-memory sliding window rate limiter for serverless instance
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;     // 30 requests per minute per IP

// Whitelisted Gemini models
const ALLOWED_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
const DEFAULT_MODEL = 'gemini-2.5-flash';

// Maximum allowed payload limits
const MAX_PROMPT_LENGTH = 35000; // characters
const MAX_BASE64_LENGTH = 7 * 1024 * 1024; // ~5MB raw image in base64

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

  // 1. Health Check Endpoint (GET)
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ready',
      service: 'MindForge Secure Gemini Proxy',
      configured: Boolean(apiKey),
      supportedModels: ALLOWED_MODELS,
      defaultModel: DEFAULT_MODEL
    });
  }

  // Reject unsupported methods
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST and GET requests are supported.'
    });
  }

  // 2. Rate Limiting Check
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1')
    .toString()
    .split(',')[0]
    .trim();

  const now = Date.now();
  const rateData = ipRateMap.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  }

  rateData.count++;
  ipRateMap.set(clientIp, rateData);

  if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
    const retrySec = Math.ceil((rateData.resetTime - now) / 1000);
    res.setHeader('Retry-After', retrySec);
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: `Too many AI requests. Please wait ${retrySec} seconds before trying again.`
    });
  }

  // 3. API Key Check
  if (!apiKey) {
    return res.status(503).json({
      error: 'API Not Configured',
      message: 'GEMINI_API_KEY is not configured in environment variables. Please add it to your .env or Vercel Settings.'
    });
  }

  // 4. Request Body Validation
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid JSON payload.'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Request body must be a JSON object.'
    });
  }

  // Determine model
  const requestedModel = (body.model || DEFAULT_MODEL).toString().trim();
  const model = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : DEFAULT_MODEL;

  // Extract parts / prompt
  const parts = [];

  // Prompt text validation
  const promptInput = body.promptText || body.prompt;
  if (promptInput && typeof promptInput === 'string') {
    if (promptInput.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({
        error: 'Payload Too Large',
        message: `Prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters.`
      });
    }
    parts.push({ text: promptInput });
  }

  // Image base64 validation (if present)
  if (body.base64Image) {
    if (typeof body.base64Image !== 'string' || body.base64Image.length > MAX_BASE64_LENGTH) {
      return res.status(400).json({
        error: 'Payload Too Large',
        message: 'Base64 image exceeds maximum allowed size (5MB).'
      });
    }

    const mimeType = (body.mimeType || 'image/png').toLowerCase();
    const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return res.status(400).json({
        error: 'Unsupported Media Type',
        message: 'Only image/jpeg, image/png, and image/webp are allowed.'
      });
    }

    const cleanBase64 = body.base64Image.includes(',')
      ? body.base64Image.split(',')[1]
      : body.base64Image;

    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: cleanBase64
      }
    });
  }

  // Support direct parts array if provided
  if (Array.isArray(body.parts) && body.parts.length > 0 && parts.length === 0) {
    for (const p of body.parts) {
      if (p.text && typeof p.text === 'string') {
        if (p.text.length > MAX_PROMPT_LENGTH) {
          return res.status(400).json({
            error: 'Payload Too Large',
            message: 'Prompt text exceeds maximum allowed length.'
          });
        }
        parts.push({ text: p.text });
      } else if (p.inline_data && p.inline_data.data) {
        parts.push(p);
      }
    }
  }

  if (parts.length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'No prompt text or image content provided.'
    });
  }

  // 5. Construct Google Gemini API Request
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const requestBody = {
    contents: [
      {
        parts: parts
      }
    ],
    generationConfig: {
      temperature: typeof body.temperature === 'number' ? Math.max(0, Math.min(1.0, body.temperature)) : 0.4,
      maxOutputTokens: typeof body.maxOutputTokens === 'number' ? Math.max(128, Math.min(4096, body.maxOutputTokens)) : 2048
    }
  };

  try {
    const upstreamResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey // Secure header authentication
      },
      body: JSON.stringify(requestBody)
    });

    if (!upstreamResponse.ok) {
      const errText = await upstreamResponse.text();
      let errorJson = null;
      try {
        errorJson = JSON.parse(errText);
      } catch (e) {
        // Non-JSON error
      }

      const statusCode = upstreamResponse.status;
      if (statusCode === 429) {
        return res.status(429).json({
          error: 'Quota Exceeded',
          message: 'Free Gemini API quota limit reached. Please wait or check your account quota in Google AI Studio.'
        });
      }

      if (statusCode === 403) {
        return res.status(403).json({
          error: 'Access Denied',
          message: 'Gemini API authentication failed. Please verify that your API key is valid in Google AI Studio.'
        });
      }

      return res.status(statusCode).json({
        error: 'Upstream API Error',
        message: errorJson?.error?.message || `Google Gemini API returned status ${statusCode}.`
      });
    }

    const data = await upstreamResponse.json();
    const candidate = data.candidates?.[0];
    const textReply = candidate?.content?.parts?.[0]?.text || '';

    return res.status(200).json({
      status: 'success',
      model: model,
      reply: textReply,
      text: textReply,
      candidates: data.candidates || []
    });
  } catch (err) {
    console.error('[MindForge Gemini Proxy] Fetch error:', err.message);
    return res.status(502).json({
      error: 'Gateway Error',
      message: 'Failed to communicate with Google Gemini API.'
    });
  }
}
