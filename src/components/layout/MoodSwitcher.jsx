import { useTranslation } from 'react-i18next'
import { SmileyWink, Cloud, FireSimple, CircleDashed } from '@phosphor-icons/react'
import { useMoodStore } from '../../store/useMoodStore'

const MOOD_TYPES = ['happy', 'calm', 'stressed', 'neutral']

/* Phosphor іконки замість емодзі — duotone для виразності */
const MOOD_ICONS = {
  happy:    <SmileyWink   size={20} weight="duotone" />,
  calm:     <Cloud        size={20} weight="duotone" />,
  stressed: <FireSimple   size={20} weight="duotone" />,
  neutral:  <CircleDashed size={20} weight="duotone" />,
}

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
            <span className="sb-emoji">{MOOD_ICONS[mood]}</span>
            {t(`demo.options.${mood}.name`)}
          </button>
        ))}
      </div>
    </div>
  )
}