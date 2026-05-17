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

  return `You are a psychological counselor. Analyze this PANAS emotional profile:
- Overall Mood State: ${moods[mood]}
- Wellbeing Index: ${totalIndex}/10
- Detailed Scales: ${scalesText}

Provide exactly 3-4 highly personalized, unique recommendations based on the highest or lowest score scales to help the user.
The output language must be strictly ${lang === 'uk' ? 'Ukrainian' : 'English'}.
Each recommendation text must be very concise (maximum 10-12 words) to prevent token exhaustion.

For each point, pick the most appropriate icon type: "light" (for joy/positivity), "brain" (for logic/focus), "star" (for energy/activity), or "shield" (for stress relief/safety).`;
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
          temperature:     0.7, 
          maxOutputTokens: 1000, 
          topP:            0.95,
          responseMimeType: "application/json",
          // Змінено на зміну snake_case для стабільної версії v1 API
          response_schema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                type: { type: "STRING", enum: ["light", "brain", "star", "shield"] },
                title: { type: "STRING" },
                text: { type: "STRING" }
              },
              required: ["type", "title", "text"]
            }
          }
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

    // Тепер тут залізно буде чистий, динамічний JSON
    const recommendations = JSON.parse(rawText)

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('EMPTY_RESPONSE')
    }

    return recommendations.slice(0, 4)

  } catch (globalError) {
    console.error('КРИТИЧНА ПОМИЛКА ДЕ СТАВСЯ ЗБІЙ:', globalError)
    throw globalError
  }
}