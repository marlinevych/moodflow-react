import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Залишаємо лише емодзі та технічний ідентифікатор для ключів перекладу
const AUDIENCE_ITEMS = [
  { id: 's1', emoji: '🎓' },
  { id: 's2', emoji: '🎨' },
  { id: 's3', emoji: '💼' },
]

function AudienceCard({ id, emoji, delay }) {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <div ref={ref} className={`audience-card reveal reveal-delay-${delay}`}>
      <span className="audience-emoji">{emoji}</span>
      {/* Підтягуємо заголовок та опис за id (s1, s2, s3) */}
      <h3>{t(`audience.${id}_title`)}</h3>
      <p>{t(`audience.${id}_desc`)}</p>
    </div>
  )
}

export default function Audience() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal()

  return (
    <section id="audience">
      <div className="container">
        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag">{t('audience.tag')}</div>
          <h2>{t('audience.title')}</h2>
          <p className="section-desc">
            {t('audience.desc')}
          </p>
        </div>

        <div className="audience-grid">
          {AUDIENCE_ITEMS.map((item, i) => (
            <AudienceCard 
              key={item.id} 
              id={item.id} 
              emoji={item.emoji} 
              delay={i + 1} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}