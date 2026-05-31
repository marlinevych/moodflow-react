import { useTranslation } from 'react-i18next'
import { GraduationCap, PaintBrush, Briefcase } from '@phosphor-icons/react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const AUDIENCE_ITEMS = [
  {
    id:   's1',
    Icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #6c4ff6, #a78bfa)',
    shadow:   'rgba(108,79,246,0.35)',
  },
  {
    id:   's2',
    Icon: PaintBrush,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    shadow:   'rgba(245,158,11,0.35)',
  },
  {
    id:   's3',
    Icon: Briefcase,
    gradient: 'linear-gradient(135deg, #059669, #34d399)',
    shadow:   'rgba(5,150,105,0.35)',
  },
]

function AudienceCard({ id, Icon, gradient, shadow, delay }) {
  const { t } = useTranslation()
  const ref   = useScrollReveal()

  return (
    <div ref={ref} className={`audience-card reveal reveal-delay-${delay}`}>
      <div style={{
        width:          72,
        height:         72,
        borderRadius:   '50%',
        background:     gradient,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        margin:         '0 auto 20px',
        boxShadow:      `0 12px 32px ${shadow}`,
        animation:      'orb-pulse 3s ease-in-out infinite',
        flexShrink:     0,
      }}>
        <Icon size={34} weight="duotone" color="white" />
      </div>

      <h3>{t(`audience.${id}_title`)}</h3>
      <p>{t(`audience.${id}_desc`)}</p>
    </div>
  )
}

export default function Audience() {
  const { t }     = useTranslation()
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