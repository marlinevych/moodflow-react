import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" fill="var(--accent)" opacity="0.2"/>
                <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="var(--accent2)" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="10" cy="16" r="2" fill="var(--accent2)"/>
                <circle cx="18" cy="16" r="2" fill="var(--accent2)"/>
                <path d="M11 20c1.7 1.3 4.3 1.3 6 0" stroke="var(--accent2)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              MoodFlow
            </a>
            <p>{t('footer.brand_desc')}</p>
          </div>

          <div className="footer-nav">
            <h4>{t('footer.nav')}</h4>
            <ul>
              <li><a href="#how">{t('nav.how')}</a></li>
              <li><a href="#demo">{t('nav.demo')}</a></li>
              <li><a href="#history">{t('nav.history')}</a></li>
              <li><a href="#benefits">{t('nav.benefits')}</a></li>
              <li><a href="#testimonials">{t('testimonials.title')}</a></li>
            </ul>
          </div>

          <div className="footer-nav">
            <h4>{t('footer.info')}</h4>
            <ul>
              <li><a href="#">{t('footer.links.about')}</a></li>
              <li><a href="#">{t('footer.links.privacy')}</a></li>
              <li><a href="#">{t('footer.links.terms')}</a></li>
              <li><a href="#">{t('footer.links.contacts')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <span>{t('common.location')}</span>
        </div>
      </div>
    </footer>
  )
}