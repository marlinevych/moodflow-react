export const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// ЛОКАЛІЗАЦІЯ: Наш власний словник перекладів, який ніколи не обірветься
const LOCALIZATION = {
  uk: {
    light_title: "Радість у дрібницях",
    light_text: "Додайте у свій день маленькі приємні заняття, які викликають посмішку та покращують настрій.",
    brain_title: "Розумове розвантаження",
    brain_text: "Зробіть коротку паузу: зафіксуйте поточні думки на папері або переключіть увагу на дихання.",
    star_title: "Активація енергії",
    star_text: "Додайте легкої фізичної активності або увімкніть улюблену динамічну музику для тонусу.",
    shield_title: "Управління стресом",
    shield_text: "Захистіть свій простір від зайвого шуму, обмежте новини та фокусуйтеся на тому, що можете контролювати."
  },
  en: {
    light_title: "Joy in Small Things",
    light_text: "Consciously add small pleasant activities to your day that bring a smile and boost your mood.",
    brain_title: "Mental Offloading",
    brain_text: "Take a short break: clear your mind by writing down thoughts or focusing on your breathing.",
    star_title: "Energy Activation",
    star_text: "Engage in light physical activity or play your favorite dynamic music to increase your tone.",
    shield_title: "Stress Management",
    shield_text: "Protect your space from noise, limit news intake, and focus on what you can control."
  }
};

function buildPrompt(scores, totalIndex, mood) {
  const scalesText = Object.entries(scores).map(([k, v]) => `${k}: ${v}%`).join(', ');

  return `You are a psychological data analyzer. Analyze this psychological PANAS profile:
- Overall State: ${mood}
- Wellbeing Index: ${totalIndex}/10
- Detailed Scales: ${scalesText}

Based on the weakest or strongest scales, choose exactly 3-4 distinct categories from this list: "light", "brain", "star", "shield".

CRITICAL: Your response must be strictly a raw JSON array of objects, no markdown blocks.
Expected format:
[
  { "type": "light" },
  { "type": "shield" },
  { "type": "brain" }
]`;
}

export async function getRecommendations({ apiKey, scores, totalIndex, mood, language = 'uk' }) {
  if (!apiKey) throw new Error('NO_API_KEY')

  const prompt = buildPrompt(scores, totalIndex, mood)
  const currentLang = language === 'uk' ? 'uk' : 'en';

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     0.1, // Максимальна точність
          maxOutputTokens: 200, // JSON тепер крихітний, 200 токенів вистачить з головою!
          topP:            0.1,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 400) throw new Error('INVALID_KEY')
      if (response.status === 429) throw new Error('RATE_LIMIT')
      throw new Error('API_ERROR')
    }

    const data = await response.json()
    let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('PARSE_ERROR')

    const rawTypes = JSON.parse(jsonMatch[0])
    if (!Array.isArray(rawTypes) || rawTypes.length === 0) throw new Error('EMPTY_RESPONSE')

    // Мапимо отримані типи на наш залізобетонний словник перекладів
    const recommendations = rawTypes.map(item => {
      const type = item.type || 'light';
      return {
        type: type,
        title: LOCALIZATION[currentLang][`${type}_title`] || LOCALIZATION[currentLang].light_title,
        text: LOCALIZATION[currentLang][`${type}_text`] || LOCALIZATION[currentLang].light_text
      };
    });

    return recommendations.slice(0, 4)

  } catch (globalError) {
    console.error('КРИТИЧНА ПОМИЛКА ДЕ СТАВСЯ ЗБІЙ:', globalError)
    throw globalError
  }
}