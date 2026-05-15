import { useTranslation } from 'react-i18next'
import { getLocalizedQuestions } from '../../data/questions'

export default function QuizStart({ onStart }) {
  const { t } = useTranslation()

  // 1. Отримуємо локалізований масив питань
  const questions = getLocalizedQuestions(t)

  const labels = [
    t('scales.joy'),
    t('scales.calm'),
    t('scales.energy'),
    t('scales.focus'),
    t('scales.stress')
  ]

  return (
    <div className="quiz-question-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24, paddingTop: 8 }}>
      
      <div style={{ fontSize: 72, lineHeight: 1, animation: 'orb-pulse 3s ease-in-out infinite' }}>
        🧠
      </div>

      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, transition: 'var(--transition)' }}>
          {t('quiz.start_title') || 'Готовий почати?'}
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto' }}>
          {t('quiz.start_desc_prefix') || 'Відповідай на'} 
          {/* 2. ВИПРАВЛЕНО: замість QUESTIONS.length тепер questions.length */}
          <strong style={{ color: 'var(--accent)' }}> {questions.length} {t('quiz.question_count') || 'питань'}</strong> 
          {t('quiz.start_desc_suffix') || ' чесно. Займає лише '}
          <strong style={{ color: 'var(--accent)' }}>1–2 {t('quiz.minutes') || 'хвилини'}</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {labels.map((label) => (
          <span
            key={label}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--bg-card-border)',
              color: 'var(--accent)',
              fontSize: 13,
              fontWeight: 600,
              padding: '7px 16px',
              borderRadius: 50,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <button className="btn-primary" onClick={onStart} style={{ animation: 'none' }}>
        {t('quiz.start_btn') || 'Почати тест'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  )
}