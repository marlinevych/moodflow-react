import { useTranslation } from 'react-i18next'
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const MOOD_TYPES = ['happy', 'calm', 'stressed', 'neutral']
const MOOD_EMOJIS = {
  happy: '😄',
  calm: '😌',
  stressed: '😤',
  neutral: '😐'
}

export default function Demo() {
  const { t } = useTranslation()
  const currentMood   = useMoodStore((s) => s.currentMood)
  const setMood       = useMoodStore((s) => s.setMood)
  const setLastResult = useMoodStore((s) => s.setLastResult)
  const openQuiz      = useMoodStore((s) => s.openQuiz)

  const moodData  = MOODS[currentMood] ?? MOODS.neutral

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

          {/* ── Підхід 1: Аналітичний тест ── */}
          <div className="quiz-trigger-wrap">
            <span className="quiz-trigger-label">{t('demo.quiz_label')}</span>
            <button className="btn-quiz-trigger" onClick={openQuiz}>
              {t('demo.quiz_btn')}
            </button>
          </div>

          {/* Розділювач */}
          <div className="demo-divider">{t('demo.divider')}</div>

          {/* ── Підхід 2: Прямий вибір ── */}
          <div className="demo-question">{t('demo.question')}</div>

          <div className="mood-options">
            {MOOD_TYPES.map((mood) => (
              <div
                key={mood}
                className={`mood-opt ${currentMood === mood ? 'active' : ''}`}
                onClick={() => handleDirectMoodSelect(mood)}
              >
                <span className="opt-emoji">{MOOD_EMOJIS[mood]}</span>
                <div className="opt-name">{t(`demo.options.${mood}.name`)}</div>
                <div className="opt-desc">{t(`demo.options.${mood}.desc`)}</div>
              </div>
            ))}
          </div>

          {/* Результат адаптації */}
          <div className="demo-result">
            <div className="demo-result-label">
              <div className="result-dot" />
              <div className="result-badge">
                {/* Динамічний переклад бейджа: Active Mode: Happy / Активний режим: Happy */}
                {t(`demo.results.${currentMood}.badge`)}
              </div>
            </div>
            
            {/* Динамічний переклад головного тексту опису */}
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