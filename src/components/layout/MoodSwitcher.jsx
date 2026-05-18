import { useTranslation } from 'react-i18next'
import { SmileyWink, CloudSun, Flame, YinYang } from '@phosphor-icons/react'
import { useMoodStore } from '../../store/useMoodStore'

const MOOD_CONFIG = {
  happy:    { Icon: SmileyWink, activeColor: '#f59e0b' },
  calm:     { Icon: CloudSun,   activeColor: '#059669' },
  stressed: { Icon: Flame,      activeColor: '#dc2626' },
  neutral:  { Icon: YinYang,    activeColor: '#6c4ff6' },
}
const MOOD_TYPES = ['happy', 'calm', 'stressed', 'neutral']

export default function MoodSwitcher() {
  const { t }       = useTranslation()
  const currentMood = useMoodStore((s) => s.currentMood)
  const setMood     = useMoodStore((s) => s.setMood)

  return (
    <div className="mood-switcher">
      <div className="switcher-label">{t('mood_switcher.label')}</div>
      <div className="switcher-btns">
        {MOOD_TYPES.map((mood) => {
          const { Icon, activeColor } = MOOD_CONFIG[mood]
          const isActive = currentMood === mood
          return (
            <button
              key={mood}
              className={`switcher-btn ${isActive ? 'active' : ''}`}
              onClick={() => setMood(mood)}
            >
              <span className="sb-emoji" style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  size={18}
                  weight={isActive ? 'fill' : 'duotone'}
                  color={isActive ? activeColor : 'var(--text-muted)'}
                />
              </span>
              {t(`demo.options.${mood}.name`)}
            </button>
          )
        })}
      </div>
    </div>
  )
}