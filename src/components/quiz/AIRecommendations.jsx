import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Robot, SparkleIcon, Key, ArrowClockwise, ArrowRight, Warning } from '@phosphor-icons/react'
import { getRecommendations, ENV_API_KEY } from '../../services/geminiService'

export default function AIRecommendations({ result, language = 'uk' }) {
  const [state,           setState] = useState('idle')
  const [manualKey,       setManual] = useState('')
  const [savedKey,        setSaved]  = useState(() => localStorage.getItem('moodflow_gemini_key') ?? '')
  const [recommendations, setRecs]   = useState([])
  const [errorMsg,        setError]  = useState('')

  const lang = language === 'uk' ? 'uk' : 'en'

  const UI = {
    uk: {
      btn:         'Отримати AI-рекомендації',
      btn_sub:     'Персоналізований аналіз від Gemini на основі твого PANAS-профілю',
      powered:     'Powered by Google Gemini 1.5 Flash',
      loading:     'Gemini аналізує твій афективний профіль…',
      key_title:   'Введи Gemini API ключ',
      key_desc:    'Безкоштовно на',
      key_hint:    '→ Натисни «Create API key»',
      key_ph:      'AIzaSy...',
      key_btn:     'Отримати рекомендації',
      key_privacy: 'Ключ зберігається тільки у твоєму браузері',
      badge:       'AI-рекомендації',
      retry:       'Спробувати ще раз',
      change_key:  'Змінити ключ',
      errors: {
        NO_API_KEY:     'Введи API ключ щоб продовжити',
        INVALID_KEY:    'Невірний API ключ. Перевір його на aistudio.google.com',
        RATE_LIMIT:     'Перевищено ліміт (15 запитів/хв). Зачекай хвилину',
        NETWORK_ERROR:  'Мережева помилка. Перевір підключення до інтернету',
        PARSE_ERROR:    'Помилка парсингу відповіді. Спробуй ще раз',
        EMPTY_RESPONSE: 'Gemini повернув порожню відповідь. Спробуй ще раз',
        API_ERROR:      'Помилка Gemini API. Спробуй ще раз',
      },
    },
    en: {
      btn:         'Get AI Recommendations',
      btn_sub:     'Personalized analysis from Gemini based on your PANAS profile',
      powered:     'Powered by Google Gemini 1.5 Flash',
      loading:     'Gemini is analyzing your affective profile…',
      key_title:   'Enter Gemini API Key',
      key_desc:    'Free at',
      key_hint:    '→ Click «Create API key»',
      key_ph:      'AIzaSy...',
      key_btn:     'Get Recommendations',
      key_privacy: 'Key stored only in your browser',
      badge:       'AI Recommendations',
      retry:       'Try again',
      change_key:  'Change key',
      errors: {
        NO_API_KEY:     'Enter your API key to continue',
        INVALID_KEY:    'Invalid API key. Check it at aistudio.google.com',
        RATE_LIMIT:     'Rate limit exceeded (15 req/min). Wait a minute',
        NETWORK_ERROR:  'Network error. Check your internet connection',
        PARSE_ERROR:    'Could not parse response. Try again',
        EMPTY_RESPONSE: 'Gemini returned empty response. Try again',
        API_ERROR:      'Gemini API error. Try again',
      },
    },
  }

  const ui = UI[lang]

  function getActiveKey() {
    if (ENV_API_KEY) return ENV_API_KEY
    if (savedKey)   return savedKey
    return manualKey.trim()
  }

  const fetchRecs = useCallback(async (keyOverride) => {
    const key = keyOverride ?? getActiveKey()
    if (!key) { setState('key_prompt'); return }

    setState('loading')
    setError('')

    try {
      const recs = await getRecommendations({
        apiKey: key, scores: result.scores,
        totalIndex: result.totalIndex, mood: result.mood, language: lang,
      })
      setRecs(recs)
      setState('done')
    } catch (err) {
      setError(ui.errors[err.message] ?? ui.errors.API_ERROR)
      setState('error')
    }
  }, [result, lang, savedKey, manualKey])

  function handleMainBtn() {
    const key = getActiveKey()
    key ? fetchRecs(key) : setState('key_prompt')
  }

  function handleKeySubmit(e) {
    e.preventDefault()
    const key = manualKey.trim()
    if (!key) return
    localStorage.setItem('moodflow_gemini_key', key)
    setSaved(key)
    fetchRecs(key)
  }

  function clearKey() {
    localStorage.removeItem('moodflow_gemini_key')
    setSaved('')
    setManual('')
    setState('idle')
  }

  const wrap = {
    background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)',
    borderRadius: 'var(--border-radius)', overflow: 'hidden',
    transition: 'var(--transition)', marginBottom: 4,
  }
  const pad = { padding: '24px 20px' }

  return (
    <div style={wrap}>
      <AnimatePresence mode="wait">

        {/* ══ IDLE ══ */}
        {state === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ ...pad, textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
              background: 'linear-gradient(135deg, #4285f4, #34a853)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(66,133,244,0.3)',
            }}>
              <Robot size={28} weight="duotone" color="white" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              {ui.btn}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.5, maxWidth: 340, margin: '0 auto 18px' }}>
              {ui.btn_sub}
            </p>
            <button onClick={handleMainBtn} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #4285f4, #34a853)',
              color: '#fff', border: 'none', borderRadius: 50,
              padding: '11px 22px', fontSize: 14, fontWeight: 700,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(66,133,244,0.3)', transition: 'all 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <Robot size={16} weight="fill" />
              {ui.btn}
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>{ui.powered}</p>
          </motion.div>
        )}

        {/* ══ KEY PROMPT ══ */}
        {state === 'key_prompt' && (
          <motion.div key="key_prompt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={pad}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Key size={18} weight="duotone" color="var(--accent)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {ui.key_title}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
              {ui.key_desc}{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontWeight: 600 }}>
                aistudio.google.com
              </a>{' '}
              {ui.key_hint}
            </p>
            <form onSubmit={handleKeySubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input type="password" value={manualKey} onChange={e => setManual(e.target.value)}
                placeholder={ui.key_ph} autoFocus
                style={{
                  flex: '1 1 200px', padding: '10px 14px', borderRadius: 12, fontSize: 13,
                  border: '1.5px solid var(--bg-card-border)', background: 'var(--bg-card)',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-body)', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e  => e.target.style.borderColor = 'var(--bg-card-border)'}
              />
              <button type="submit" disabled={!manualKey.trim()}
                style={{
                  flexShrink: 0, padding: '10px 16px', borderRadius: 12, border: 'none',
                  background: 'var(--btn-bg)', color: 'var(--btn-text)',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
                  cursor: manualKey.trim() ? 'pointer' : 'not-allowed',
                  opacity: manualKey.trim() ? 1 : 0.4, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <ArrowRight size={14} weight="bold" />
                {ui.key_btn}
              </button>
            </form>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Key size={12} weight="duotone" />
              {ui.key_privacy}
            </p>
          </motion.div>
        )}

        {/* ══ LOADING ══ */}
        {state === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ ...pad, textAlign: 'center', paddingTop: 36, paddingBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }}
                />
              ))}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{ui.loading}</p>
          </motion.div>
        )}

        {/* ══ DONE ══ */}
        {state === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{
              padding: '14px 20px', borderBottom: '1px solid var(--bg-card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Robot size={18} weight="duotone" color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {ui.badge}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #4285f4, #34a853)', color: '#fff',
                }}>Gemini</span>
              </div>
              {!ENV_API_KEY && (
                <button onClick={clearKey}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Key size={12} weight="duotone" />
                  {ui.change_key}
                </button>
              )}
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recommendations.map((rec, i) => {
                // Мапимо текстовий тип від Gemini на твої реальні SVG-файли (без початкового слеша)
                const iconMap = {
                  light: 'icons/light_white.svg',
                  brain: 'icons/brain_white.svg',
                  star:  'icons/star_white.svg',
                  shield: 'icons/shield.svg'
                };

                const iconSrc = iconMap[rec.type] || 'icons/light_white.svg';

                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: 'flex', gap: 14, alignItems: 'center', // вирівнюємо по центру для акуратності
                      background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
                      borderRadius: 14, padding: '14px 16px',
                    }}>
                    
                    {/* Мінімалістичний контейнер для SVG-іконки замість емодзі */}
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: 'var(--bg-secondary)', // або твоє фірмове забарвлення
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <img 
                        src={iconSrc} 
                        alt={rec.type} 
                        style={{ width: 20, height: 20, display: 'block' }} 
                      />
                    </div>

                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                        {rec.title}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                        {rec.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ══ ERROR ══ */}
        {state === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ ...pad, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <Warning size={36} weight="duotone" color="#dc2626" />
            </div>
            <p style={{ fontSize: 14, color: '#dc2626', marginBottom: 16, lineHeight: 1.5 }}>{errorMsg}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => fetchRecs(getActiveKey())}
                style={{
                  padding: '10px 20px', borderRadius: 50, background: 'var(--btn-bg)',
                  color: 'var(--btn-text)', border: 'none', fontSize: 13, fontWeight: 700,
                  fontFamily: 'var(--font-body)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <ArrowClockwise size={14} weight="bold" />
                {ui.retry}
              </button>
              {!ENV_API_KEY && (
                <button onClick={clearKey}
                  style={{
                    padding: '10px 20px', borderRadius: 50, background: 'transparent',
                    color: 'var(--text-secondary)', border: '2px solid var(--bg-card-border)',
                    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Key size={14} weight="duotone" />
                  {ui.change_key}
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}