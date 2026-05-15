import { useEffect, lazy, Suspense } from 'react'
import { useMoodStore } from './store/useMoodStore'
import { MOODS } from './data/moods'

/* ── Layout — завантажуємо одразу (потрібні на старті) ──── */
import Nav          from './components/layout/Nav'
import Footer       from './components/layout/Footer'
import ProgressBar  from './components/layout/ProgressBar'
import MoodSwitcher from './components/layout/MoodSwitcher'

/* ── Секції вище fold — одразу ───────────────────────────── */
import Hero       from './components/sections/Hero'
import HowItWorks from './components/sections/HowItWorks'
import Demo       from './components/sections/Demo'

/* ── Решта секцій — lazy (не потрібні до скролу) ────────── */
const Benefits     = lazy(() => import('./components/sections/Benefits'))
const Audience     = lazy(() => import('./components/sections/Audience'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const MoodHistory  = lazy(() => import('./components/sections/MoodHistory'))
const CTA          = lazy(() => import('./components/sections/CTA'))

/* ── Квіз — lazy (відкривається тільки по кліку) ─────────── */
const QuizModal = lazy(() => import('./components/quiz/QuizModal'))

/* ── Простий fallback поки компонент завантажується ─────── */
function SectionFallback() {
  return (
    <div style={{
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: '50%',
        border: '3px solid var(--bg-card-border)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )
}

export default function App() {
  const currentMood = useMoodStore((s) => s.currentMood)
  const quizOpen    = useMoodStore((s) => s.quizOpen)

  /* Застосовуємо CSS-змінні теми на :root */
  useEffect(() => {
    const vars = MOODS[currentMood]?.cssVars ?? {}
    const root = document.documentElement
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
  }, [currentMood])

  /* Блокуємо скрол коли квіз відкритий */
  useEffect(() => {
    document.body.style.overflow = quizOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [quizOpen])

  return (
    <>
      <ProgressBar />
      <Nav />

      <main>
        {/* Секції above fold — без lazy */}
        <Hero />
        <HowItWorks />
        <Demo />

        {/* Решта — lazy з Suspense */}
        <Suspense fallback={<SectionFallback />}>
          <Benefits />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Audience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <MoodHistory />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CTA />
        </Suspense>
      </main>

      <Footer />
      <MoodSwitcher />

      {/* Квіз — рендериться тільки коли відкритий */}
      {quizOpen && (
        <Suspense fallback={null}>
          <QuizModal />
        </Suspense>
      )}
    </>
  )
}