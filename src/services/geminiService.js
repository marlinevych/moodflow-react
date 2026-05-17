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

  return `You are a psychological counselor specializing in emotional state management.
Analyze this PANAS test profile:
- Mood: ${moods[mood]}
- Wellbeing index: ${totalIndex}/10
- Scales: ${scalesText}

Provide exactly 3-4 brief personalized recommendations in ${lang === 'uk' ? 'Ukrainian' : 'English'}.

CRITICAL: Your response must be a valid JSON array of objects. Do not use markdown blocks, text formatting, or conversational notes. 

Each object must have a "type" string that strictly matches one of these categories based on the advice content: "light", "brain", "star", or "shield".

Expected JSON format:
[
  { "type": "light", "title": "Short Title", "text": "Recommendation text." },
  { "type": "brain", "title": "Short Title", "text": "Recommendation text." }
]`;
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
          temperature:     0.2, // Низька температура гарантує точне дотримання формату
          maxOutputTokens: 700,
          topP:            0.9,
          // МИ ПОВНІСТЮ ПРИБРАЛИ РЯДОК responseMimeType ЩОБ УНИКНУТИ ПОМИЛКИ 400
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
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Очищаємо текст від можливих маркдаун-обгорток ```json ... ```
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    // Надійний пошук масиву [ ... ] всередині будь-якого тексту
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("Отриманий текст не містить JSON масиву:", rawText)
      throw new Error('PARSE_ERROR')
    }

    let recommendations;
    try {
      recommendations = JSON.parse(jsonMatch[0])
    } catch (parseExc) {
      console.error("Помилка всередині JSON.parse:", parseExc, "Текст:", jsonMatch[0])
      throw new Error('PARSE_ERROR')
    }

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('EMPTY_RESPONSE')
    }

    return recommendations.slice(0, 4)

  } catch (globalError) {
    console.error('КРИТИЧНА ПОМИЛКА ДЕ СТАВСЯ ЗБІЙ:', globalError)
    throw globalError
  }
}