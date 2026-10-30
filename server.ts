import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route: Generate Chibi Lore & Attributes using Gemini 3.8 Flash
  app.post('/api/generate-chibi', async (req, res) => {
    try {
      const {
        baseCharacterName,
        baseSeriesName,
        fusionCharacterName,
        theme,
        mood,
        element,
        companion,
        customPrompt,
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback simulated response if no API key is provided
        return res.json({
          success: true,
          data: {
            name: fusionCharacterName
              ? `${baseCharacterName} × ${fusionCharacterName}`
              : `${theme || 'Neo'} ${baseCharacterName}`,
            japaneseName: `${baseCharacterName} (特製)`,
            rarity: Math.random() > 0.4 ? '5-Star UR' : '4-Star SSR',
            catchphrase: fusionCharacterName
              ? `Waku Waku! With this infinite power, nobody can stop us!`
              : `Entering ${theme || 'Special'} Mode! Let us go!`,
            catchphraseAudioText: `Ikimashou! Saikyou no chibi desu!`,
            personalityTags: [
              theme?.split(' ')[0] || 'Custom',
              element || 'Cosmic',
              'Chibi Special',
              'Limited Drop',
            ],
            lore: `A special ${theme || 'chibi'} variant forged in the ChibiRealm lab. Harmonizes ${element || 'astral'} mana with ${companion || 'a loyal mascot companion'}.`,
            element: element || 'Cosmic',
            height: '14 cm (Pocket scale)',
            favoriteItem: `${companion || 'Chibi Mascot'} & Special Sweets`,
            expressions: [
              {
                id: 'gen-1',
                name: mood || 'Signature Smug',
                emoji: '✨',
                dialogue: `Look at this incredible ${theme || 'power'}! You like it, right?`,
                moodColor: '#4cd7f6',
                description: 'Radiating immense chibi charisma',
              },
              {
                id: 'gen-2',
                name: 'Battle Focus 100%',
                emoji: '⚡',
                dialogue: `Elemental ${element || 'energy'} activated! Ready for action!`,
                moodColor: '#ff516a',
                description: 'Eyes glittering with determined energy',
              },
              {
                id: 'gen-3',
                name: 'Adorable Pout',
                emoji: '🥺',
                dialogue: 'Do not forget to feed my companion first...',
                moodColor: '#d0bcff',
                description: 'Cute pouty cheeks demanding treats',
              },
              {
                id: 'gen-4',
                name: 'Victorious Fanfare',
                emoji: '🌟',
                dialogue: 'Heh! Mission completed with 100 stars rating!',
                moodColor: '#fbbf24',
                description: 'Celebrating triumph with starlight confetti',
              },
            ],
          },
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const promptText = `You are the lead anime character designer for an adorable collectible chibi game named "ChibiRealm".
Generate a new, officially styled chibi variant card based on the following input:
- Base Character: ${baseCharacterName} (${baseSeriesName})
${fusionCharacterName ? `- Fusion Partner: ${fusionCharacterName}` : ''}
- Theme / Outfit Archetype: ${theme || 'Fantasy Cyberpunk'}
- Desired Mood: ${mood || 'Smug & Confident'}
- Elemental Affinity: ${element || 'Cosmic'}
- Companion Mascot: ${companion || 'Mini Plushie'}
${customPrompt ? `- Custom User Notes: ${customPrompt}` : ''}

Generate an imaginative, kawaii, and authentic anime chibi character card profile.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Creative full variant name (e.g. Cyber-Anya [Eden Protocol], Astral Sage Frieren)' },
              japaneseName: { type: Type.STRING, description: 'Japanese title or katakana/kanji representation' },
              rarity: { type: Type.STRING, description: 'Must be either "5-Star UR" or "4-Star SSR"' },
              catchphrase: { type: Type.STRING, description: 'Iconic punchy English catchphrase' },
              catchphraseAudioText: { type: Type.STRING, description: 'Short Japanese romaji or expressive vocalization for audio speech synthesis' },
              personalityTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 personality or archetype tags',
              },
              lore: { type: Type.STRING, description: '2-3 sentences of funny, adorable chibi lore' },
              height: { type: Type.STRING, description: 'e.g. "12 cm (Chibi scale)"' },
              favoriteItem: { type: Type.STRING, description: 'e.g. "Holographic peanut & mini staff"' },
              expressions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    emoji: { type: Type.STRING },
                    dialogue: { type: Type.STRING },
                    moodColor: { type: Type.STRING, description: 'Hex color matching mood like #4cd7f6 or #ff516a' },
                    description: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'emoji', 'dialogue', 'moodColor', 'description'],
                },
              },
            },
            required: [
              'name',
              'japaneseName',
              'rarity',
              'catchphrase',
              'catchphraseAudioText',
              'personalityTags',
              'lore',
              'height',
              'favoriteItem',
              'expressions',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from model');
      }

      const parsedData = JSON.parse(responseText);
      return res.json({ success: true, data: parsedData });
    } catch (error) {
      console.error('Error generating chibi character:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown generation error',
      });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
