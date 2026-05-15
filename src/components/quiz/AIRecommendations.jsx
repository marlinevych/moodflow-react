import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRecommendations } from '../../services/geminiService'
import { useMoodStore } from '../../store/useMoodStore'

/**
 * AIRecommendations
 *
 * Компонент для отримання персоналізованих рекомендацій від Gemini AI
 * на основі результатів PANAS-тесту.
 *
 * Підключається в QuizResult після блоку з індексом.
 *
 * Props:
 *   result   — { mood, scores, totalIndex }
 *   language — 'uk' | 'en'
 */
export default function AIRecommendations({ result, language = 'uk' }) {
  const [state, setState] = useState('idle') // idle | key_prompt | loading | done | error
  const [apiKey, setApiKey]             = useState('')
  const [savedKey, setSavedKey]         = useState(() => localStorage.getItem('gemini_api_key') ?? '')
  const [recommendations, setRecs]      = useState([])
  const [errorMsg, setErrorMsg]         = useState('')

  const ERROR_MESSAGES = {
    uk: {
      NO_API_KEY:     'Введи API ключ щоб продовжити',
      INVALID_KEY:    'Невірний API ключ. Перевір його в Google AI Studio',
      RATE_LIMIT:     'Перевищено ліміт запитів. Спробуй через хвилину',
      PARSE_ERROR:    'Не вдалося обробити відповідь. Спробуй ще раз',
      EMPTY_RESPONSE: 'Gemini не надав рекомендацій. Спробуй ще раз',
      API_ERROR:      'Помилка API. Спробуй ще раз',
    },
    en: {
      NO_API_KEY:     'Enter your API key to continue',
      INVALID_KEY:    'Invalid API key. Check it in Google AI Studio',
      RATE_LIMIT:     'Rate limit exceeded. Try again in a minute',
      PARSE_ERROR:    'Could not parse response. Try again',
      EMPTY_RESPONSE: 'Gemini returned no recommendations. Try again',
      API_ERROR:      'API error. Try again',
    },
  }

  const lang = language === 'uk' ? 'uk' : 'en'

  /* ── Запит до Gemini ──────────────────────────────────── */
  const fetchRecs = useCallback(async (key) => {
    setState('loading')
    setErrorMsg('')

    try {
      const recs = await getRecommendations({
        apiKey:     key,
        scores:     result.scores,
        totalIndex: result.totalIndex,
        mood:       result.mood,
        language:   lang,
      })
      setRecs(recs)
      setState('done')
    } catch (err) {
      const msg = ERROR_MESSAGES[lang][err.message] ?? ERROR_MESSAGES[lang].API_ERROR
      setErrorMsg(msg)
      setState('error')
    }
  }, [result, lang])

  /* ── Збереження ключа і запит ─────────────────────────── */
  function handleKeySubmit(e) {
    e.preventDefault()
    const key = apiKey.trim()
    if (!key) return

    // Зберігаємо ключ локально для зручності
    localStorage.setItem('gemini_api_key', key)
    setSavedKey(key)
    fetchRecs(key)
  }

  /* ── Якщо вже є збережений ключ — одразу запитуємо ──── */
  function handleQuickFetch() {
    if (savedKey) {
      fetchRecs(savedKey)
    } else {
      setState('key_prompt')
    }
  }

  const UI = {
    uk: {
      trigger:      'Отримати рекомендації ШІ',
      trigger_sub:  'Персоналізований аналіз від Gemini на основі твоїх результатів',
      powered:      'Powered by Google Gemini',
      loading:      'Gemini аналізує твій афективний профіль...',
      key_title:    'Введи Gemini API ключ',
      key_desc:     'Безкоштовно на',
      key_link:     'aistudio.google.com',
      key_placeholder: 'AIza...',
      key_btn:      'Отримати рекомендації',
      retry:        'Спробувати ще раз',
      change_key:   'Змінити ключ',
      badge:        'AI-рекомендації',
    },
    en: {
      trigger:      'Get AI Recommendations',
      trigger_sub:  'Personalized analysis from Gemini based on your results',
      powered:      'Powered by Google Gemini',
      loading:      'Gemini is analyzing your affective profile...',
      key_title:    'Enter Gemini API Key',
      key_desc:     'Free at',
      key_link:     'aistudio.google.com',
      key_placeholder: 'AIza...',
      key_btn:      'Get Recommendations',
      retry:        'Try again',
      change_key:   'Change key',
      badge:        'AI Recommendations',
    },
  }
  const ui = UI[lang]

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--bg-card-border)',
      borderRadius: 'var(--border-radius)',
      overflow: 'hidden',
      transition: 'var(--transition)',
    }}>

      <AnimatePresence mode="wait">

        {/* ── Стан: idle — кнопка запуску ── */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🤖</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 6,
            }}>
              {ui.trigger}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
              {ui.trigger_sub}
            </p>
            <button
              onClick={handleQuickFetch}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #4285f4, #34a853)',
                color: '#fff', border: 'none', borderRadius: 50,
                padding: '12px 24px', fontSize: 14, fontWeight: 700,
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(66,133,244,0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ✨ {ui.trigger}
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
              {ui.powered}
            </p>
          </motion.div>
        )}

        {/* ── Стан: key_prompt — форма для ключа ── */}
        {state === 'key_prompt' && (
          <motion.div
            key="key_prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ padding: '24px' }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 8,
            }}>
              🔑 {ui.key_title}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              {ui.key_desc}{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontWeight: 600 }}
              >
                {ui.key_link}
              </a>
              {' '}→ Get API key
            </p>

            <form onSubmit={handleKeySubmit} style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={ui.key_placeholder}
                autoFocus
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: 12, fontSize: 13,
                  border: '1.5px solid var(--bg-card-border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--bg-card-border)'}
              />
              <button
                type="submit"
                disabled={!apiKey.trim()}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: 'none',
                  background: 'var(--btn-bg)', color: 'var(--btn-text)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                  cursor: apiKey.trim() ? 'pointer' : 'not-allowed',
                  opacity: apiKey.trim() ? 1 : 0.4,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {ui.key_btn}
              </button>
            </form>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              🔒 Ключ зберігається тільки у твоєму браузері (localStorage)
            </p>
          </motion.div>
        )}

        {/* ── Стан: loading ── */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '40px 24px', textAlign: 'center' }}
          >
            {/* Пульсуючі крапки */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {ui.loading}
            </p>
          </motion.div>
        )}

        {/* ── Стан: done — рекомендації ── */}
        {state === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Шапка */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--bg-card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14, fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {ui.badge}
                </span>
                {/* Google Gemini бейдж */}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #4285f4, #34a853)',
                  color: '#fff',
                }}>
                  Gemini
                </span>
              </div>
              <button
                onClick={() => setState('idle')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {ui.change_key}
              </button>
            </div>

            {/* Список рекомендацій */}
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--bg-card-border)',
                    borderRadius: 14, padding: '14px 16px',
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>
                    {rec.icon ?? '💡'}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14, fontWeight: 700,
                      color: 'var(--text-primary)', marginBottom: 4,
                    }}>
                      {rec.title}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {rec.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Стан: error ── */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontSize: 14, color: '#dc2626', marginBottom: 16, lineHeight: 1.5 }}>
              {errorMsg}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => savedKey ? fetchRecs(savedKey) : setState('key_prompt')}
                style={{
                  padding: '10px 20px', borderRadius: 50,
                  background: 'var(--btn-bg)', color: 'var(--btn-text)',
                  border: 'none', fontSize: 13, fontWeight: 700,
                  fontFamily: 'var(--font-body)', cursor: 'pointer',
                }}
              >
                {ui.retry}
              </button>
              <button
                onClick={() => { setSavedKey(''); localStorage.removeItem('gemini_api_key'); setState('key_prompt') }}
                style={{
                  padding: '10px 20px', borderRadius: 50,
                  background: 'transparent', color: 'var(--text-secondary)',
                  border: '2px solid var(--bg-card-border)',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-body)', cursor: 'pointer',
                }}
              >
                {ui.change_key}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}