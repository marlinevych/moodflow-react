import { useState, useCallback } from 'react'
import { useMoodStore } from '../../store/useMoodStore'
import { MOODS } from '../../data/moods'
import QuizStart    from './QuizStart'
import QuizQuestion from './QuizQuestion'
import QuizResult   from './QuizResult'
import { FocusTrap } from 'focus-trap-react'
import { useTranslation } from 'react-i18next'

// Імпортуємо локалізатор та мапінг
import { getLocalizedQuestions, SCALE_TO_MOOD } from '../../data/questions'

const EMPTY_SCORES = { joy: 0, calm: 0, energy: 0, focus: 0, stress: 0 }

function normalize(raw, totalQuestions) {
  const max = totalQuestions * 10
  const result = {}
  for (const k in raw) {
    result[k] = Math.min(100, Math.round((raw[k] / max) * 100))
  }
  return result
}

function calcIndex(s) {
  const raw =
    s.joy    * 0.25 +
    s.calm   * 0.20 +
    s.energy * 0.20 +
    s.focus  * 0.25 -
    s.stress * 0.10
  return Math.round(Math.min(10, Math.max(0, (raw / 90) * 10)) * 10) / 10
}

function getDominant(s) {
  if (s.stress >= 65) return 'stress'
  let best = 'joy', max = -1
  for (const k of ['joy', 'calm', 'energy', 'focus']) {
    if (s[k] > max) { max = s[k]; best = k }
  }
  return best
}

export default function QuizModal() {
  const { t } = useTranslation();
  const questions = getLocalizedQuestions(t);
  
  const closeQuiz     = useMoodStore((s) => s.closeQuiz)
  const setMood       = useMoodStore((s) => s.setMood)
  const setLastResult = useMoodStore((s) => s.setLastResult)
  const addToHistory  = useMoodStore((s) => s.addToHistory)

  const [screen,    setScreen]   = useState('start')
  const [qIndex,    setQIndex]   = useState(0)
  const [rawScores, setRaw]      = useState({ ...EMPTY_SCORES })
  const [result,    setResult]   = useState(null)

  const handleStart = useCallback(() => {
    setQIndex(0)
    setRaw({ ...EMPTY_SCORES })
    setResult(null)
    setScreen('question')
  }, [])

  const handleAnswer = useCallback((answerIndex) => {
    const currentQuestion = questions[qIndex]
    if (!currentQuestion) return

    const answered = currentQuestion.answers[answerIndex].scores

    setRaw((prev) => {
      const next = { ...prev }
      for (const k in answered) next[k] += answered[k]

      if (qIndex + 1 >= questions.length) {
        const norm       = normalize(next, questions.length)
        const totalIndex = calcIndex(norm)
        const dominant   = getDominant(norm)
        
        const mood       = SCALE_TO_MOOD ? SCALE_TO_MOOD[dominant] : 'neutral'
        const moodData   = MOODS[mood] || MOODS.neutral

        const finalResult = {
          mood,
          scores:     norm,
          totalIndex,
          dominant,
          emoji: moodData.emoji,
          score: String(totalIndex),
          bars:  [norm.joy, norm.calm, norm.energy, norm.focus],
        }

        setTimeout(() => {
          setResult(finalResult)
          setScreen('result')
        }, 0)
      }
      return next
    })

    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1)
    }
  }, [qIndex, questions])

  const handleApply = useCallback(() => {
    if (!result) return
    setMood(result.mood)
    setLastResult(result)
    addToHistory({
      mood:       result.mood,
      scores:     result.scores,
      totalIndex: result.totalIndex,
    })
    closeQuiz()
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 400)
  }, [result, setMood, setLastResult, addToHistory, closeQuiz])

  const handleRetry = useCallback(() => handleStart(), [handleStart])

  function handleBgClick(e) {
    if (e.target === e.currentTarget) closeQuiz()
  }

  const progress = screen === 'result'
    ? 100
    : Math.round((qIndex / questions.length) * 100)

  const progressLabel = screen === 'result'
    ? `${questions.length} / ${questions.length}`
    : `${qIndex + 1} / ${questions.length}`

  return (
    <div className="quiz-overlay active" onClick={handleBgClick}>
      <div className="quiz-overlay-bg" onClick={closeQuiz} />
      <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
        <div
          className="quiz-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t('quiz.title')}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="quiz-header">
            <div className="quiz-header-left">
              <div className="quiz-title">{t('quiz.title')}</div>
              <div className="quiz-subtitle">
                {t('quiz.subtitle')} - {questions.length} {t('quiz.question_count')}
              </div>
            </div>
            <button
              className="quiz-close"
              onClick={closeQuiz}
              aria-label={t('quiz.close') || '✕'}
            >
              ✕
            </button>
          </div>

          <div className="quiz-progress-wrap">
            <div className="quiz-progress-info">
              <span className="quiz-progress-label">{t('quiz.progress')}</span>
              <span className="quiz-progress-num">{progressLabel}</span>
            </div>
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {screen === 'start' && <QuizStart onStart={handleStart} />}

          {screen === 'question' && (
            <QuizQuestion
              question={questions[qIndex]}
              questionIndex={qIndex}
              total={questions.length}
              onAnswer={handleAnswer}
            />
          )}

          {screen === 'result' && result && (
            <QuizResult
              result={result}
              onApply={handleApply}
              onRetry={handleRetry}
            />
          )}
        </div>
      </FocusTrap>
    </div>
  )
}