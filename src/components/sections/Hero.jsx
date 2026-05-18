import { useTranslation } from 'react-i18next'
import {
  SmileyWink, CloudSun, Flame, YinYang,
  Sparkle, ArrowRight,
} from '@phosphor-icons/react'
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'

const BAR_LABELS = ['scales.joy', 'scales.calm', 'scales.energy', 'scales.focus']

/**
 * Конфіг орбу — іконка + градієнт для кожного настрою.
 * Показується ЗАВЖДИ (і при прямому виборі, і після тесту).
 * Після тесту emoji більше не ставиться — тільки іконка з результуючим mood.
 */
const MOOD_ORB = {
  neutral:  {
    Icon:     YinYang,
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #6c4ff6 100%)',
    glow:     'rgba(108,79,246,0.4)',
  },
  happy:    {
    Icon:     SmileyWink,
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    glow:     'rgba(245,158,11,0.4)',
  },
  calm:     {
    Icon:     CloudSun,
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    glow:     'rgba(5,150,105,0.4)',
  },
  stressed: {
    Icon:     Flame,
    gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
    glow:     'rgba(220,38,38,0.4)',
  },
}

export default function Hero() {
  const { t }        = useTranslation()
  const currentMood  = useMoodStore((s) => s.currentMood)
  const lastResult   = useMoodStore((s) => s.lastResult)
  const moodData     = MOODS[currentMood] ?? MOODS.neutral

  /**
   * Орб завжди показує іконку поточного настрою.
   * Якщо є lastResult — беремо mood з нього (він може відрізнятись від currentMood
   * лише якщо тест не застосований, тому безпечно брати currentMood).
   */
  const isTestResult = lastResult?.mood === currentMood
  const orbMood      = currentMood
  const { Icon, gradient, glow } = MOOD_ORB[orbMood] ?? MOOD_ORB.neutral

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

          {/* ── Лівий блок ── */}
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkle size={15} weight="fill" />
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

          {/* ── Карточка ── */}
          <div className="hero-visual">
            <div className="hero-card">

              {/* Орб — завжди іконка, колір змінюється з настроєм */}
              <div
                className="mood-orb"
                style={{
                  background:  gradient,
                  boxShadow:   `0 20px 60px ${glow}`,
                  transition:  'background 0.6s cubic-bezier(0.4,0,0.2,1), box-shadow 0.6s',
                }}
              >
                <Icon size={52} weight="duotone" color="white" />
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

              <div style={{
                marginTop: 10, fontSize: 11,
                color: 'var(--text-muted)', textAlign: 'center', opacity: 0.7,
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