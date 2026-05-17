import { useTranslation } from 'react-i18next'
import { Sparkle, ArrowRight } from '@phosphor-icons/react'
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'

const BAR_LABELS = ['scales.joy', 'scales.calm', 'scales.energy', 'scales.focus']

/* Phosphor-іконка в орбі замість емодзі (коли немає результату тесту) */
const MOOD_ORB_ICONS = {
  neutral:  <Sparkle size={52} weight="duotone" color="white" />,
  happy:    <Sparkle size={52} weight="fill"    color="white" />,
  calm:     <Sparkle size={52} weight="thin"    color="white" />,
  stressed: <Sparkle size={52} weight="bold"    color="white" />,
}

export default function Hero() {
  const { t } = useTranslation()
  const currentMood = useMoodStore((s) => s.currentMood)
  const lastResult  = useMoodStore((s) => s.lastResult)

  const moodData    = MOODS[currentMood] ?? MOODS.neutral
  const isTestResult = lastResult?.mood === currentMood

  /* Якщо є результат тесту — показуємо емодзі з результату,
     якщо прямий вибір — показуємо Phosphor іконку */
  const orbContent = isTestResult
    ? <span style={{ fontSize: 48 }}>{lastResult.emoji}</span>
    : MOOD_ORB_ICONS[currentMood] ?? MOOD_ORB_ICONS.neutral

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
            {/* Бейдж — Phosphor Sparkle замість ✨ */}
            <div className="hero-badge">
              <Sparkle size={16} weight="fill" />
              {t('hero.badge')}
            </div>

            <h1>
              {t('hero.title_start')}{' '}
              <span className="accent">{t('hero.title_accent')}</span>{' '}
              {t('hero.title_rest')}
            </h1>
            <p className="hero-sub">{t('hero.sub')}</p>

            <button className="btn-primary" onClick={scrollToDemo}>
              {t('hero.btn')}
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>

          <div className="hero-visual">
            <div className="hero-card">

              {/* Орб — Phosphor іконка або емодзі з тесту */}
              <div className="mood-orb">
                {orbContent}
              </div>

              {/* Шкали */}
              <div className="mood-bars">
                {BAR_LABELS.map((labelKey, i) => (
                  <div className="mood-bar-row" key={labelKey}>
                    <span>{t(labelKey)}</span>
                    <div className="mood-bar-track">
                      <div className="mood-bar-fill" style={{ width: `${bars[i]}%` }} />
                    </div>
                    <span>{bars[i]}%</span>
                  </div>
                ))}
              </div>

              <div className="mood-score">
                <strong key={score}>{score}</strong>
                {t('hero.index_label')}
              </div>

              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.7 }}>
                {isTestResult ? t('hero.is_test') : t('hero.is_default')}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}