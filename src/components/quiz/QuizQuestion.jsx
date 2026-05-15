import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function QuizQuestion({ question, questionIndex, total, onAnswer }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const isLast = questionIndex + 1 === total

  // Скидаємо вибір при кожному новому питанні
  useEffect(() => {
    setSelected(null)
  }, [question])

  function handleNext() {
    if (selected === null) return
    onAnswer(selected)
  }

  // Розрахунок точок прогресу (крапочки внизу)
  const block = Math.ceil(total / 2)
  const firstRow = Array.from({ length: Math.min(block, total) })
  const secondRow = Array.from({ length: Math.max(0, total - block) })

  // Мітки PA/NA
  const panasLabel = question.panas === 'PA'
    ? { text: t('quiz.pa_label') || 'PA', color: 'var(--accent)' }
    : { text: t('quiz.na_label') || 'NA', color: '#dc2626' }

  return (
    <>
      <div className="quiz-question-area">
        <div className="quiz-question-wrap">
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 12, marginBottom: 15 }}>
            <span className="quiz-q-number">
              {t('quiz.question') || 'Питання'} {questionIndex + 1}
            </span>
            <span style={{
              fontSize: 10,
              letterSpacing: '0.05em',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              background: question.panas === 'PA' ? 'var(--bg-secondary)' : '#fff1f2',
              color: panasLabel.color,
              border: `1px solid ${question.panas === 'PA' ? 'var(--bg-card-border)' : '#fca5a5'}`,
            }}>
              {panasLabel.text}
            </span>
          </div>

          {/* ВИПРАВЛЕНО: Використовуємо question.text (готовий переклад) */}
          <h2 className="quiz-q-text">{question.text}</h2>

          <div className="quiz-answers">
            {question.answers.map((ans, idx) => (
              <button 
                key={idx} 
                className={`quiz-answer-btn ${selected === idx ? 'selected' : ''}`}
                onClick={() => setSelected(idx)}
              >
                <span className="answer-letter">{String.fromCharCode(65 + idx)}</span>
                
                {/* ВИПРАВЛЕНО: Прибрали емодзі, використовуємо ans.text */}
                <span className="answer-text-content">{ans.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {firstRow.map((_, i) => (
              <div key={i} className={`scale-dot ${i <= questionIndex ? 'active' : ''}`} />
            ))}
          </div>
          {secondRow.length > 0 && (
            <div style={{ display: 'flex', gap: 6 }}>
              {secondRow.map((_, i) => {
                const globalIndex = block + i
                return <div key={i} className={`scale-dot ${globalIndex <= questionIndex ? 'active' : ''}`} />
              })}
            </div>
          )}
        </div>

        <button
          className={`btn-quiz-next ${selected !== null ? 'enabled' : ''}`}
          onClick={handleNext}
          disabled={selected === null}
        >
          {isLast ? t('quiz.finish') : t('quiz.next')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {isLast
              ? <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        </button>
      </div>
    </>
  )
}