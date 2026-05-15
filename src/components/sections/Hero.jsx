import { useTranslation } from 'react-i18next' // Додаємо імпорт
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'

// Використовуємо ключі зі сторінки перекладів замість жорсткого тексту
const BAR_LABELS = ['scales.joy', 'scales.calm', 'scales.energy', 'scales.focus']

export default function Hero() {
  const { t } = useTranslation() // Оголошуємо функцію t
  const currentMood = useMoodStore((s) => s.currentMood)
  const lastResult  = useMoodStore((s) => s.lastResult)

  const moodData = MOODS[currentMood] ?? MOODS.neutral

  const isTestResult = lastResult?.mood === currentMood

  const emoji = isTestResult ? lastResult.emoji : moodData.emoji
  const score = isTestResult ? lastResult.score : moodData.score
  const bars  = isTestResult ? lastResult.bars  : moodData.bars

  function scrollToDemo(e) {
    e.preventDefault()
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero">
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      <div className="container">
        <div className="hero-grid">

          <div className="hero-content">
            <div className="hero-badge">
              <span>✨</span>
              {t('hero.badge')}
            </div>
            <h1>
              {t('hero.title_start')} <span className="accent">{t('hero.title_accent')}</span> {t('hero.title_rest')}
            </h1>
            <p className="hero-sub">
              {t('hero.sub')}
            </p>
            <button className="btn-primary" onClick={scrollToDemo}>
              {t('hero.btn')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="mood-orb">
                <span key={emoji}>{emoji}</span>
              </div>

              <div className="mood-bars">
                {BAR_LABELS.map((labelKey, i) => (
                  <div className="mood-bar-row" key={labelKey}>
                    {/* Використовуємо t() для назв шкал */}
                    <span>{t(labelKey)}</span>
                    <div className="mood-bar-track">
                      <div
                        className="mood-bar-fill"
                        style={{ width: `${bars[i]}%` }}
                      />
                    </div>
                    <span>{bars[i]}%</span>
                  </div>
                ))}
              </div>

              <div className="mood-score">
                <strong key={score}>{score}</strong>
                {t('hero.index_label')}
              </div>

              <div style={{
                marginTop: 12,
                fontSize: 11,
                color: 'var(--text-muted)',
                textAlign: 'center',
                opacity: 0.7,
              }}>
                {isTestResult ? t('hero.is_test') : t('hero.is_default')}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}