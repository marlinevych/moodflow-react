import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function CTA() {
  const { t } = useTranslation()
  const ref = useScrollReveal()

  function scrollToDemo() {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="cta">
      <div className="container">
        <div ref={ref} className="reveal">
          <div className="cta-box">
            <h2>{t('cta.title')}</h2>
            <p>{t('cta.desc')}</p>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'relative', 
              zIndex: 1 
            }}>
              <button className="btn-white" onClick={scrollToDemo}>
                {t('cta.btn_single')}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <div className="cta-note">
              {t('cta.note')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}