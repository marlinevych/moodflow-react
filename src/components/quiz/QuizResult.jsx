import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { jsPDF } from 'jspdf'
import AIRecommendations from './AIRecommendations'

const SCALES = [
  { key: 'joy',    label: 'scales.joy',    emoji: '😄', cls: ''       },
  { key: 'calm',   label: 'scales.calm',   emoji: '😌', cls: ''       },
  { key: 'energy', label: 'scales.energy', emoji: '⚡', cls: ''       },
  { key: 'focus',  label: 'scales.focus',  emoji: '🎯', cls: ''       },
  { key: 'stress', label: 'scales.stress', emoji: '😤', cls: 'stress' },
]

/**
 * Анімує число від 0 до target (ease-out cubic)
 */
function animateNumber(el, target, decimals = 0, duration = 900) {
  if (!el) return
  const t0 = performance.now()
  function step(now) {
    const p = Math.min(1, (now - t0) / duration)
    const e = 1 - Math.pow(1 - p, 3)
    el.textContent = (target * e).toFixed(decimals)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function QuizResult({ result, onApply, onRetry }) {
  const { t, i18n } = useTranslation()
  const { mood, scores, totalIndex, emoji } = result

  /* ── Refs для анімації шкал ───────────────────────────── */
  const fillRefs = useRef({})
  const pctRefs  = useRef({})
  const indexRef = useRef(null)

  /* ── Анімуємо шкали при монтуванні ───────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      SCALES.forEach(({ key }) => {
        const val  = scores[key] ?? 0
        const fill = fillRefs.current[key]
        const pct  = pctRefs.current[key]
        if (fill) fill.style.width = `${val}%`
        if (pct)  animateNumber(pct, val, 0)
      })
      animateNumber(indexRef.current, totalIndex, 1)
    }, 120)
    return () => clearTimeout(timer)
  }, [scores, totalIndex])

  /* ── PDF export ───────────────────────────────────────── */
  const downloadPDF = async () => {
    try {
      const doc = new jsPDF()

      const fontUrl    = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf'
      const fontBytes  = await fetch(fontUrl).then(res => res.arrayBuffer())
      const fontBase64 = btoa(
        new Uint8Array(fontBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      doc.addFileToVFS('Roboto-Regular.ttf', fontBase64)
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
      doc.setFont('Roboto')

      /* Заголовок */
      doc.setFontSize(22)
      doc.setTextColor(77, 0, 237)
      doc.text('MoodFlow Report', 20, 20)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      const dateLocale = i18n.language === 'uk' ? 'uk-UA' : 'en-US'
      doc.text(`${t('quiz.pdf_date')}: ${new Date().toLocaleDateString(dateLocale)}`, 150, 20)

      doc.setDrawColor(77, 0, 237)
      doc.line(20, 25, 190, 25)

      /* Результат */
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(`${t(`demo.results.${mood}.badge`)}`, 20, 40)

      doc.setFontSize(11)
      const splitText = doc.splitTextToSize(t(`demo.results.${mood}.text`), 170)
      doc.text(splitText, 20, 50)

      /* Таблиця метрик */
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 70, 170, 65, 'F')

      doc.setFontSize(13)
      doc.setTextColor(0, 0, 0)
      doc.text(t('quiz.pdf_metrics_title'), 25, 82)

      doc.setFontSize(11)
      let y = 92
      const metrics = [
        { label: t('quiz.total_index'), val: `${totalIndex} / 10` },
        { label: t('scales.joy'),       val: `${scores.joy}%`    },
        { label: t('scales.calm'),      val: `${scores.calm}%`   },
        { label: t('scales.energy'),    val: `${scores.energy}%` },
        { label: t('scales.focus'),     val: `${scores.focus}%`  },
        { label: t('scales.stress'),    val: `${scores.stress}%` },
      ]
      metrics.forEach(m => {
        doc.text(m.label, 30, y)
        doc.text(m.val, 150, y)
        y += 8
      })

      /* Наукове джерело */
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text(
        'PANAS: Watson, D., Clark, L.A., & Tellegen, A. (1988). Journal of Personality and Social Psychology, 54(6), 1063-1070.',
        20, 148, { maxWidth: 170 }
      )

      /* Футер */
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text(t('quiz.pdf_footer'), 20, 280)

      doc.save(`MoodFlow_Report_${mood}.pdf`)
    } catch (error) {
      console.error('PDF Error:', error)
    }
  }

  return (
    <div className="quiz-results" role="region" aria-label={t('quiz.results_label')}>

      {/* ── Шапка з emoji та описом ── */}
      <div className="quiz-results-header">
        <div className="results-emoji-orb">{emoji}</div>
        <h2 className="results-mood-title">
          {t(`demo.results.${mood}.badge`)}
        </h2>
        <p className="results-mood-desc">
          {t(`demo.results.${mood}.text`)}
        </p>
      </div>

      {/* ── Шкали з анімацією появи ── */}
      <div className="quiz-scales">
        {SCALES.map(({ key, label, emoji: se, cls }) => (
          <div key={key} className={`quiz-scale-row ${cls}`}>
            <div className="scale-label">
              <span className="scale-emoji">{se}</span>
              {t(label)}
            </div>
            <div className="scale-track">
              <div
                className="scale-fill"
                ref={(el) => { fillRefs.current[key] = el }}
                style={{ width: 0 }}
              />
            </div>
            <div
              className="scale-pct"
              ref={(el) => { pctRefs.current[key] = el }}
            >
              0%
            </div>
          </div>
        ))}
      </div>

      {/* ── Загальний індекс ── */}
      <div className="quiz-total-index">
        <div className="index-number" ref={indexRef}>0</div>
        <div className="index-info">
          <div className="index-label">{t('quiz.total_index')}</div>
          <div className="index-sublabel">{t('quiz.index_formula')}</div>
        </div>
      </div>

      {/* ── AI Рекомендації від Gemini ──────────────────────
          Підключається після індексу, до кнопок.
          language береться з поточної мови i18n.
      ── */}
      <AIRecommendations
        result={result}
        language={i18n.language === 'uk' ? 'uk' : 'en'}
      />

      {/* ── Кнопки дій ── */}
      <div className="quiz-results-actions">
        <button className="btn-apply-mood" onClick={onApply}>
          {t('quiz.apply')}
        </button>
        <button className="btn-export-pdf" onClick={downloadPDF}>
          {t('quiz.export_pdf')}
        </button>
        <button className="btn-retake" onClick={onRetry}>
          {t('quiz.retake')}
        </button>
      </div>

    </div>
  )
}