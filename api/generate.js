// api/generate.js
// Vercel serverless function — API key stays on the server, never in the browser

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipient, purpose, tone, keyPoints } = req.body;

  if (!recipient || !purpose) {
    return res.status(400).json({ error: 'recipient and purpose are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY; // ✅ Server-side only — never exposed
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const prompt = `Write a ${tone || 'professional'} email to ${recipient}.
Purpose: ${purpose}
Key points to include: ${keyPoints || 'None'}
Write only the email content with Subject line. Keep it concise and effective.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: data?.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'No response from Gemini. Try again.' });
    }

    return res.status(200).json({ result: text });

  } catch (err) {
    return res.status(500).json({ error: `Network error: ${err.message}` });
  }
}
