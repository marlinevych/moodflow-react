import { useTranslation } from 'react-i18next'
import { GraduationCap, PaintBrush, Briefcase } from '@phosphor-icons/react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const AUDIENCE_ITEMS = [
  { id: 's1', Icon: GraduationCap },
  { id: 's2', Icon: PaintBrush    },
  { id: 's3', Icon: Briefcase     },
]

function AudienceCard({ id, Icon, delay }) {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <div ref={ref} className={`audience-card reveal reveal-delay-${delay}`}>
      {/* Кругла іконка замість емодзі */}
      <div className="audience-icon-wrap">
        <Icon size={40} weight="duotone" />
      </div>
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
          <p className="section-desc">{t('audience.desc')}</p>
        </div>

        <div className="audience-grid">
          {AUDIENCE_ITEMS.map((item, i) => (
            <AudienceCard key={item.id} {...item} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}