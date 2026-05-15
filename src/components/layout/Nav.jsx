import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Nav() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToDemo(e) {
    e.preventDefault()
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleLang() {
    const next = i18n.language === 'uk' ? 'en' : 'uk'
    i18n.changeLanguage(next)
    localStorage.setItem('moodflow-lang', next)
  }

  function onLangKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleLang()
    }
  }

  return (
    <>
      {/* Skip-link тепер має клас для приховування в CSS */}
      <a href="#demo" className="skip-link">
        {t('a11y.skip_nav')}
      </a>

      <nav
        id="mainNav"
        role="navigation"
        style={{ boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="12" fill="var(--accent)" opacity="0.15"/>
              <path d="M8 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="10" cy="16" r="2" fill="var(--accent)"/>
              <circle cx="18" cy="16" r="2" fill="var(--accent)"/>
              <path d="M11 20c1.7 1.3 4.3 1.3 6 0" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            MoodFlow
          </a>

          <ul className="nav-links">
            <li><a href="#how">{t('nav.how')}</a></li>
            <li><a href="#demo">{t('nav.demo')}</a></li>
            <li><a href="#history">{t('nav.history')}</a></li>
            <li><a href="#benefits">{t('nav.benefits')}</a></li>
            <li>
              <a href="#demo" className="nav-cta" onClick={scrollToDemo}>
                {t('nav.cta')}
              </a>
            </li>
          </ul>

          {/* Оновлений мінімалістичний перемикач */}
          <button
            className="lang-switcher-btn"
            onClick={toggleLang}
            onKeyDown={onLangKeyDown}
            aria-label="Toggle language"
          >
            {i18n.language === 'uk' ? 'UA' : 'EN'}
          </button>
        </div>
      </nav>
    </>
  )
}