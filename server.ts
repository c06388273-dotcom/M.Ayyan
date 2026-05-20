import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for communicating with Gemini API
  app.post('/api/generate-bio', async (req, res) => {
    try {
      const { context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      if (!context) {
        return res.status(400).json({ error: 'Context is required.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Write a highly professional, engaging, and concise professional bio summary for a resume. 
Context details: ${context}
Requirements:
1. Make it 2-3 sentences.
2. Focus on value proposition and expertise.
3. No buzzwords, keep it very professional and grounded.
4. Output ONLY the raw text bio itself. Do not include any formatting, markdown, quotes, emojis, or introductory phrases.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ bio: aiResponse.text?.trim() || '' });

    } catch (error) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'An error occurred while generating the bio.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
