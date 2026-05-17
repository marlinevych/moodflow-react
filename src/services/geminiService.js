export const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

function buildPrompt(scores, totalIndex, mood, language = 'uk') {
  const moodLabels = {
    uk: { happy: 'Радісний', calm: 'Спокійний', neutral: 'Нейтральний', stressed: 'Стресовий' },
    en: { happy: 'Joyful', calm: 'Calm', neutral: 'Neutral', stressed: 'Stressed' },
  }

  const scaleLabels = {
    uk: { joy: 'Радість', calm: 'Спокій', energy: 'Енергія', focus: 'Фокус', stress: 'Стрес' },
    en: { joy: 'Joy', calm: 'Calm', energy: 'Energy', focus: 'Focus', stress: 'Stress' },
  }

  const lang   = language === 'uk' ? 'uk' : 'en'
  const labels = scaleLabels[lang]
  const moods  = moodLabels[lang]

  const scalesText = Object.entries(scores)
    .map(([k, v]) => `${labels[k]}: ${v}%`)
    .join(', ')

  return `You are a psychological counselor. Analyze this PANAS profile:
- Mood State: ${moods[mood]}
- Wellbeing Index: ${totalIndex}/10
- Scales: ${scalesText}

Provide exactly 3 personalized, unique, dynamic recommendations tailored to this profile.
The output language must be strictly ${lang === 'uk' ? 'Ukrainian' : 'English'}.

CRITICAL FORMATED OUTPUT RULES:
You must output exactly 3 lines. No markdown, no introduction, no bullet points.
Each line must strictly follow this pattern:
ICON_TYPE|SHORT_TITLE|RECOMMENDATION_TEXT

- ICON_TYPE must be only one of these words: light, brain, star, shield.
- SHORT_TITLE must be 2-4 words.
- RECOMMENDATION_TEXT must be exactly 1 clear sentence (max 12 words).

Example of output:
shield|Зниження навантаження|Постарайтеся обмежити потік новин та зробити коротку паузу для відпочинку.
star|Активація енергії|Додайте легкої фізичної активності або увімкніть динамічну музику.`;
}

export async function getRecommendations({ apiKey, scores, totalIndex, mood, language = 'uk' }) {
  if (!apiKey) throw new Error('NO_API_KEY')

  const prompt = buildPrompt(scores, totalIndex, mood, language)

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     0.8, // Жива творчість ШІ
          maxOutputTokens: 600,
          topP:            0.95,
          // МИ ПОВНІСТЮ ПРИБРАЛИ ВСІ ВЕРЕДЛИВІ ПАРАМЕТРИ JSON-РЕЖИМІВ
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('Деталі помилки ВІД СЕРВЕРА Google:', err)
      if (response.status === 400) throw new Error('INVALID_KEY')
      if (response.status === 429) throw new Error('RATE_LIMIT')
      throw new Error('API_ERROR')
    }

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Парсимо текстові рядки розділені символом '|'
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.includes('|'))

    if (lines.length === 0) {
      console.error("Помилка структури тексту від ШІ:", rawText)
      throw new Error('PARSE_ERROR')
    }

    // Перетворюємо унікальний текст ШІ на об'єкти для React
    const recommendations = lines.map(line => {
      const [type, title, text] = line.split('|')
      const cleanType = type?.trim().toLowerCase();
      
      return {
        type: ['light', 'brain', 'star', 'shield'].includes(cleanType) ? cleanType : 'light',
        title: title?.trim() || (language === 'uk' ? 'Порада' : 'Advice'),
        text: text?.trim() || line
      }
    })

    return recommendations.slice(0, 4)

  } catch (globalError) {
    console.error('КРИТИЧНА ПОМИЛКА ДЕ СТАВСЯ ЗБІЙ:', globalError)
    throw globalError
  }
}