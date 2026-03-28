import OpenAI from 'openai';
import type { GoogleQueryData } from '../types';

const client = import.meta.env.VITE_OPENAI_API_KEY
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  : null;

const cache = new Map<string, GoogleQueryData>();

export async function generateGoogleResults(query: string): Promise<GoogleQueryData | null> {
  if (!import.meta.env.VITE_OPENAI_API_KEY || !client) return null;

  const key = query.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key)!;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: `You are simulating 2016 Google search results. Return ONLY a valid JSON object with no markdown, no code fences, no extra text. Use this exact structure:
{"results":[{"title":"...","url":"...","snippet":"..."}],"didYouMean":"...","peopleAlsoAsk":["..."],"ads":[{"title":"...","url":"...","snippet":"..."}]}

Rules:
- Include 4-6 organic results
- Results must reflect 2016 knowledge — no events, products, or people famous after 2016
- Use real websites that existed in 2016 (Wikipedia, Reddit, YouTube, news sites, etc.)
- If the topic didn't exist in 2016 (e.g. TikTok, ChatGPT), show confused/related results and set didYouMean to the closest 2016 concept
- URLs should look real but don't have to resolve
- peopleAlsoAsk: 3-4 questions
- ads: 0-2 entries only for commercial queries, omit otherwise
- didYouMean: omit if query is clear`,
        },
        {
          role: 'user',
          content: `Generate 2016 Google search results for: "${query}"`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content ?? '';
    const data = JSON.parse(text) as GoogleQueryData;
    cache.set(key, data);
    return data;
  } catch {
    return null;
  }
}
