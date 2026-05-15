import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Замість текстів залишаємо лише технічні дані (айді для ключів та аватари)
const TESTIMONIAL_KEYS = [
  { id: 'olena', avatar: '👩' },
  { id: 'max',   avatar: '👦' },
  { id: 'anna',  avatar: '👩‍💼' },
]

function TestimonialCard({ id, avatar, delay }) {
  const { t } = useTranslation()
  const ref = useScrollReveal()
  
  return (
    <div ref={ref} className={`testimonial-card reveal reveal-delay-${delay}`}>
      <div className="stars">★★★★★</div>
      {/* Динамічно отримуємо текст за ключем */}
      <p>"{t(`testimonials.items.${id}.text`)}"</p>
      <div className="testimonial-author">
        <div className="author-avatar">{avatar}</div>
        <div className="author-info">
          <div className="name">{t(`testimonials.items.${id}.name`)}</div>
          <div className="role">{t(`testimonials.items.${id}.role`)}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal()

  return (
    <section id="testimonials">
      <div className="container">
        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag">{t('testimonials.tag')}</div>
          <h2>{t('testimonials.title')}</h2>
          <p className="section-desc">
            {t('testimonials.desc')}
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIAL_KEYS.map((item, i) => (
            <TestimonialCard 
              key={item.id} 
              id={item.id} 
              avatar={item.avatar} 
              delay={i + 1} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}