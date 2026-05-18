import { useTranslation } from 'react-i18next'
import { UserCircle } from '@phosphor-icons/react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const TESTIMONIAL_KEYS = [
  { id: 'olena', gradient: 'linear-gradient(135deg, #6c4ff6, #a78bfa)' },
  { id: 'max',   gradient: 'linear-gradient(135deg, #059669, #34d399)' },
  { id: 'anna',  gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
]

function TestimonialCard({ id, gradient, delay }) {
  const { t } = useTranslation()
  const ref   = useScrollReveal()

  return (
    <div ref={ref} className={`testimonial-card reveal reveal-delay-${delay}`}>
      <div className="stars">★★★★★</div>
      <p>"{t(`testimonials.items.${id}.text`)}"</p>
      <div className="testimonial-author">
        {/* Одна іконка UserCircle — різний градієнт фону */}
        <div className="author-avatar" style={{ background: gradient }}>
          <UserCircle size={28} weight="duotone" color="white" />
        </div>
        <div className="author-info">
          <div className="name">{t(`testimonials.items.${id}.name`)}</div>
          <div className="role">{t(`testimonials.items.${id}.role`)}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t }     = useTranslation()
  const headerRef = useScrollReveal()

  return (
    <section id="testimonials">
      <div className="container">
        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag">{t('testimonials.tag')}</div>
          <h2>{t('testimonials.title')}</h2>
          <p className="section-desc">{t('testimonials.desc')}</p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIAL_KEYS.map((item, i) => (
            <TestimonialCard key={item.id} {...item} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}