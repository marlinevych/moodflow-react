import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Іконки SVG з папки public/icons/
 * Колір задається через CSS-змінну --icon-filter на :root,
 * яка оновлюється в App.jsx при зміні теми.
 * filter: var(--icon-filter) перефарбовує будь-яку SVG з темного на потрібний колір.
 */
const STEPS = [
  { num: '01', icon: '/icons/heart-hand.svg', alt: 'heart', key: 'step1' },
  { num: '02', icon: '/icons/brain_white.svg', alt: 'brain', key: 'step2' },
  { num: '03', icon: '/icons/star_white.svg',  alt: 'star',  key: 'step3' },
]

function StepCard({ num, icon, alt, titleKey, descKey, delay }) {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`step-card reveal reveal-delay-${delay}`}
      // a11y: кожна картка — article зі своїм заголовком
    >
      <span className="step-num" aria-hidden="true">{num}</span>
      <div className="step-icon" aria-hidden="true">
        <img
          src={icon}
          alt=""
          width={30}
          height={30}
          className="theme-icon"
          aria-hidden="true"
        />
      </div>
      <h3>{t(`how.${titleKey}_title`)}</h3>
      <p>{t(`how.${descKey}_desc`)}</p>
    </div>
  )
}

export default function HowItWorks() {
  const { t } = useTranslation()
  const headerRef = useScrollReveal()

  return (
    <section id="how" aria-labelledby="how-heading">
      <div className="container">
        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag" aria-hidden="true">{t('how.tag')}</div>
          <h2 id="how-heading">{t('how.title')}</h2>
          <p className="section-desc">{t('how.desc')}</p>
        </div>

        <div
          className="how-grid"
          role="list"
          aria-label="Кроки роботи з MoodFlow"
        >
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              num={step.num}
              icon={step.icon}
              alt={step.alt}
              titleKey={step.key}
              descKey={step.key}
              delay={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}