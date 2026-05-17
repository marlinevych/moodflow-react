import { useTranslation } from 'react-i18next'
import { Brain, ArrowRight } from '@phosphor-icons/react'
import { getLocalizedQuestions } from '../../data/questions'

export default function QuizStart({ onStart }) {
  const { t } = useTranslation()
  const questions = getLocalizedQuestions(t)

  const labels = [
    t('scales.joy'),
    t('scales.calm'),
    t('scales.energy'),
    t('scales.focus'),
    t('scales.stress'),
  ]

  return (
    <div className="quiz-question-area" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      gap: 24, paddingTop: 8,
    }}>

      {/* Brain іконка замість 🧠 — duotone для глибини */}
      <div style={{
        width: 88, height: 88,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        animation: 'orb-pulse 3s ease-in-out infinite',
      }}>
        <Brain size={44} weight="duotone" color="white" />
      </div>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,26px)',
          fontWeight: 800, color: 'var(--text-primary)',
          marginBottom: 12, transition: 'var(--transition)',
        }}>
          {t('quiz.start_title')}
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
          {t('quiz.start_desc_prefix')}
          <strong style={{ color: 'var(--accent)' }}> {questions.length} {t('quiz.question_count')}</strong>
          {t('quiz.start_desc_suffix')}
          <strong style={{ color: 'var(--accent)' }}>1–2 {t('quiz.minutes')}</strong>.
        </p>
      </div>

      {/* Таблетки шкал — без емодзі, тільки текст */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {labels.map((label) => (
          <span key={label} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--bg-card-border)',
            color: 'var(--accent)',
            fontSize: 13, fontWeight: 600,
            padding: '7px 16px', borderRadius: 50,
          }}>
            {label}
          </span>
        ))}
      </div>

      <button className="btn-primary" onClick={onStart} style={{ animation: 'none' }}>
        {t('quiz.start_btn')}
        <ArrowRight size={18} weight="bold" />
      </button>
    </div>
  )
}