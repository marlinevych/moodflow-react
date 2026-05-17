export const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

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

  if (lang === 'uk') {
    return `Ти — психолог-консультант, що спеціалізується на управлінні емоційним станом.
Користувач пройшов адаптований тест PANAS (Positive and Negative Affect Schedule).

Результати тесту:
- Загальний афективний стан: ${moods[mood]}
- Загальний індекс благополуччя: ${totalIndex}/10
- Детальні шкали: ${scalesText}

Надай короткі персоналізовані рекомендації (3-4 пункти) що допоможуть покращити або підтримати поточний емоційний стан.

Формат відповіді — JSON масив об'єктів (строго дотримуйся синтаксису ком):
[
  { "icon": "emoji", "title": "Коротка назва (3-4 слова)", "text": "Рекомендація (1-2 речення)" }
]

Тільки чистий JSON, без маркдауну та без твоїх пояснень.`
  }

  return `You are a psychological counselor specializing in emotional state management.
The user completed an adapted PANAS test.

Test results:
- Overall affective state: ${moods[mood]}
- Wellbeing index: ${totalIndex}/10
- Scale details: ${scalesText}

Provide brief personalized recommendations (3-4 points) to improve or maintain the current emotional state.

Response format — JSON array of objects:
[
  { "icon": "emoji", "title": "Short title (3-4 words)", "text": "Recommendation (1-2 sentences)" }
]

JSON only, no explanations. Emojis should match the recommendation theme.`
}

export async function getRecommendations({ apiKey, scores, totalIndex, mood, language = 'uk' }) {
  if (!apiKey) throw new Error('NO_API_KEY')

  const prompt = buildPrompt(scores, totalIndex, mood, language)

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 600,
        topP:            0.9,
        responseMimeType: "application/json", // Змушує сервер віддати чистий JSON без тексту
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    if (response.status === 400) throw new Error('INVALID_KEY')
    if (response.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(err?.error?.message ?? 'API_ERROR')
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Безпечний парсинг масиву
  const jsonMatch = rawText.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('PARSE_ERROR')

  const recommendations = JSON.parse(jsonMatch[0])

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    throw new Error('EMPTY_RESPONSE')
  }

  return recommendations.slice(0, 4)
}