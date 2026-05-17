/**
 * geminiService.js
 *
 * Сервіс для отримання персоналізованих рекомендацій
 * на основі результатів тесту PANAS через Google Gemini API.
 *
 * Модель: gemini-1.5-flash (безкоштовний tier)
 *   — 15 запитів/хвилину
 *   — 1 500 000 токенів/день
 *   — Повністю безкоштовно без кредитної картки
 *
 * Отримати API ключ: https://aistudio.google.com/app/apikey
 *
 * Науковий контекст (для курсової):
 *   Використання LLM для інтерпретації психометричних даних
 *   є напрямом досліджень у галузі affective computing та
 *   human-computer interaction (HCI).
 */
export const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

/**
 * Будує промпт для Gemini на основі результатів PANAS-тесту.
 *
 * @param {object} scores    — { joy, calm, energy, focus, stress } у %
 * @param {number} totalIndex — загальний індекс 0–10
 * @param {string} mood      — 'happy' | 'calm' | 'neutral' | 'stressed'
 * @param {string} language  — 'uk' | 'en'
 */
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

Користувач пройшов адаптований тест PANAS (Positive and Negative Affect Schedule, Watson et al., 1988).

Результати тесту:
- Загальний афективний стан: ${moods[mood]}
- Загальний індекс благополуччя: ${totalIndex}/10
- Детальні шкали: ${scalesText}

Надай короткі персоналізовані рекомендації (3-4 пункти) що допоможуть покращити або підтримати поточний емоційний стан. Враховуй конкретні значення шкал.

Формат відповіді — JSON масив об'єктів:
[
  { "icon": "title": "Коротка назва (3-4 слова)", "text": "Рекомендація (1-2 речення)" }
]

Тільки JSON, без пояснень.`
  }

  return `You are a psychological counselor specializing in emotional state management.

The user completed an adapted PANAS test (Positive and Negative Affect Schedule, Watson et al., 1988).

Test results:
- Overall affective state: ${moods[mood]}
- Wellbeing index: ${totalIndex}/10
- Scale details: ${scalesText}

Provide brief personalized recommendations (3-4 points) to improve or maintain the current emotional state. Consider the specific scale values.

Response format — JSON array of objects:
[
  { "icon": "title": "Short title (3-4 words)", "text": "Recommendation (1-2 sentences)" }
]

JSON only, no explanations. Icons should match the recommendation theme.`
}

/**
 * getRecommendations()
 * Основна функція — відправляє запит до Gemini і повертає рекомендації.
 *
 * @param {string} apiKey
 * @param {object} scores     — { joy, calm, energy, focus, stress }
 * @param {number} totalIndex
 * @param {string} mood
 * @param {string} language   — 'uk' | 'en'
 * @returns {Promise<Array>}  — масив { icon, title, text }
 */
export async function getRecommendations({ apiKey, scores, totalIndex, mood, language = 'uk' }) {
  if (!apiKey) throw new Error('NO_API_KEY')

  const prompt = buildPrompt(scores, totalIndex, mood, language)

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     0.7,   // баланс між творчістю і точністю
        maxOutputTokens: 600,   // достатньо для 4 рекомендацій
        topP:            0.9,
        responseMimeType: "application/json",
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

  // Витягуємо текст відповіді
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Парсимо JSON з відповіді (Gemini іноді обгортає в ```json ... ```)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('PARSE_ERROR')

  const recommendations = JSON.parse(jsonMatch[0])

  // Валідуємо структуру
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    throw new Error('EMPTY_RESPONSE')
  }

  return recommendations.slice(0, 4) // максимум 4 рекомендації
}