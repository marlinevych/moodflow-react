import { useTranslation } from 'react-i18next'
import { SmileyWink, CloudSun, Flame, YinYang, Brain, ArrowRight } from '@phosphor-icons/react'
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const MOOD_TYPES = ['happy', 'calm', 'stressed', 'neutral']

/**
 * Phosphor іконки + кольори для карток вибору.
 * activeColor — колір іконки коли картка активна або при ховері.
 * baseColor   — приглушений колір у дефолтному стані.
 */
const MOOD_CONFIG = {
  happy:    { Icon: SmileyWink, activeColor: '#f59e0b', baseColor: '#fbbf24' },
  calm:     { Icon: CloudSun,   activeColor: '#059669', baseColor: '#34d399' },
  stressed: { Icon: Flame,      activeColor: '#dc2626', baseColor: '#f87171' },
  neutral:  { Icon: YinYang,    activeColor: '#6c4ff6', baseColor: '#a78bfa' },
}

export default function Demo() {
  const { t }         = useTranslation()
  const currentMood   = useMoodStore((s) => s.currentMood)
  const setMood       = useMoodStore((s) => s.setMood)
  const setLastResult = useMoodStore((s) => s.setLastResult)
  const openQuiz      = useMoodStore((s) => s.openQuiz)
  const moodData      = MOODS[currentMood] ?? MOODS.neutral

  const headerRef = useScrollReveal()
  const wrapRef   = useScrollReveal()

  function handleDirectMoodSelect(mood) {
    setLastResult(null)
    setMood(mood)
  }

  return (
    <section id="demo">
      <div className="container">

        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag">{t('demo.tag')}</div>
          <h2>{t('demo.title')}</h2>
          <p className="section-desc">{t('demo.desc')}</p>
        </div>

        <div ref={wrapRef} className="demo-wrapper reveal">

          {/* ── Кнопка запуску тесту ── */}
          <div className="quiz-trigger-wrap">
            <span className="quiz-trigger-label">{t('demo.quiz_label')}</span>
            <button className="btn-quiz-trigger" onClick={openQuiz}>
              <Brain size={18} weight="duotone" />
              {t('demo.quiz_btn')}
            </button>
          </div>

          <div className="demo-divider">{t('demo.divider')}</div>

          <div className="demo-question">{t('demo.question')}</div>

          {/* ── Картки вибору настрою ── */}
          <div className="mood-options">
            {MOOD_TYPES.map((mood) => {
              const { Icon, activeColor, baseColor } = MOOD_CONFIG[mood]
              const isActive = currentMood === mood
              return (
                <div
                  key={mood}
                  className={`mood-opt ${isActive ? 'active' : ''}`}
                  onClick={() => handleDirectMoodSelect(mood)}
                >
                  {/* Кругла іконка — замість opt-emoji */}
                  <div className="mood-opt-icon" style={{
                    width:          56,
                    height:         56,
                    borderRadius:   '50%',
                    background:     isActive
                      ? `linear-gradient(135deg, ${baseColor}, ${activeColor})`
                      : 'var(--bg-primary)',
                    border:         `2px solid ${isActive ? activeColor : 'var(--bg-card-border)'}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    margin:         '0 auto 12px',
                    transition:     'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    <Icon
                      size={28}
                      weight={isActive ? 'fill' : 'duotone'}
                      color={isActive ? 'white' : activeColor}
                    />
                  </div>
                  <div className="opt-name">{t(`demo.options.${mood}.name`)}</div>
                  <div className="opt-desc">{t(`demo.options.${mood}.desc`)}</div>
                </div>
              )
            })}
          </div>

          {/* Результат */}
          <div className="demo-result">
            <div className="demo-result-label">
              <div className="result-dot" />
              <div className="result-badge">{t(`demo.results.${currentMood}.badge`)}</div>
            </div>
            <p>{t(`demo.results.${currentMood}.text`)}</p>
            <div className="demo-tags">
              <span className="demo-tag">{t('demo.tags.palette')}</span>
              <span className="demo-tag">{t('demo.tags.shapes')}</span>
              <span className="demo-tag">{t('demo.tags.density')}</span>
              <span className="demo-tag">{t('demo.tags.anim')}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}