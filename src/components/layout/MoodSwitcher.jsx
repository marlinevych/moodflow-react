import { useTranslation } from 'react-i18next'
import { useMoodStore } from '../../store/useMoodStore'

const MOOD_TYPES = ['happy', 'calm', 'stressed', 'neutral']
const MOOD_EMOJIS = {
  happy: '😄',
  calm: '😌',
  stressed: '😠',
  neutral: '😐'
}

/* віджет в нижньому куті */
export default function MoodSwitcher() {
  const { t } = useTranslation()
  const currentMood = useMoodStore((s) => s.currentMood)
  const setMood     = useMoodStore((s) => s.setMood)

  return (
    <div className="mood-switcher">
      <div className="switcher-label">{t('mood_switcher.label')}</div>
      <div className="switcher-btns">
        {MOOD_TYPES.map((mood) => (
          <button
            key={mood}
            className={`switcher-btn ${currentMood === mood ? 'active' : ''}`}
            onClick={() => setMood(mood)}
          >
            <span className="sb-emoji">{MOOD_EMOJIS[mood]}</span>
            {t(`demo.options.${mood}.name`)}
          </button>
        ))}
      </div>
    </div>
  )
}