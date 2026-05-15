import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const BENEFITS = [
  { icon: '/icons/light_white.svg',  alt: 'bulb',  key: 'b1' },
  { icon: '/icons/brain_white.svg',  alt: 'brain', key: 'b2' },
  { icon: '/icons/star_white.svg',   alt: 'star',  key: 'b3' },
  { icon: '/icons/shield.svg',       alt: 'shield', key: 'b4' },
]

function BenefitCard({ icon, alt, titleKey, delay }) {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`benefit-card reveal reveal-delay-${delay}`}
      role="article"
    >
      <div className="benefit-icon" aria-hidden="true">
        <img
          src={icon}
          alt={alt}
          width={26}
          height={26}
          className="theme-icon"
          aria-hidden="true"
        />
      </div>
      <div>
        {/* Ключі мають бути benefits.b1_title, benefits.b1_desc і т.д. */}
        <h3>{t(`benefits.${titleKey}_title`)}</h3>
        <p>{t(`benefits.${titleKey}_desc`)}</p>
      </div>
    </div>
  )
}

export default function Benefits() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal()

  return (
    <section id="benefits" aria-labelledby="benefits-heading">
      <div className="container">
        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag" aria-hidden="true">{t('benefits.tag')}</div>
          <h2 id="benefits-heading">{t('benefits.title')}</h2>
          <p className="section-desc">{t('benefits.desc')}</p>
        </div>

        <div className="benefits-grid" role="list">
          {BENEFITS.map((b, i) => (
            <BenefitCard
              key={b.key}
              icon={b.icon}
              alt={b.alt}
              titleKey={b.key}
              delay={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}