import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { useMoodStore } from '../../store/useMoodStore'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/* ── Мета-дані шкал ──────────────────────────────────────── */
const SCALE_META = [
  { key: 'joy',    labelKey: 'scales.joy',    color: '#f59e0b' },
  { key: 'calm',   labelKey: 'scales.calm',   color: '#059669' },
  { key: 'energy', labelKey: 'scales.energy', color: '#f97316' },
  { key: 'focus',  labelKey: 'scales.focus',  color: '#6c4ff6' },
  { key: 'stress', labelKey: 'scales.stress', color: '#dc2626' },
]

const MOOD_EMOJI = { happy: '🌟', calm: '🌿', neutral: '✨', stressed: '🔥' }

function formatDate(iso, locale = 'uk-UA') {
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

/* ── Кастомний тултіп ────────────────────────────────────── */
function CustomTooltip({ active, payload }) {
  const { t } = useTranslation()
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
      borderRadius: 12, padding: '12px 16px', fontSize: 13,
      boxShadow: 'var(--card-shadow)',
    }}>
      {SCALE_META.map(({ key, labelKey, color }) => (
        <p key={key} style={{ color, marginBottom: 3 }}>
          {t(labelKey)}: <strong>{d?.[key] ?? 0}%</strong>
        </p>
      ))}
    </div>
  )
}

/* ── Картка одного запису ────────────────────────────────── */
function HistoryCard({ entry, index, onDelete }) {
  const { t, i18n } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
        borderRadius: 'var(--border-radius)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <span style={{ fontSize: 28, flexShrink: 0 }}>{MOOD_EMOJI[entry.mood] ?? '✨'}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
          {t(`mood.${entry.mood}`)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {formatDate(entry.date, i18n.language === 'uk' ? 'uk-UA' : 'en-US')} · {t('quiz.total_index')}:{' '}
          <strong style={{ color: 'var(--accent)' }}>{entry.totalIndex}</strong>
        </div>
      </div>

      {/* Міні-стовпчики шкал */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
        {SCALE_META.map(({ key, labelKey, color }) => (
          <div
            key={key}
            title={`${t(labelKey)}: ${entry.scores?.[key] ?? 0}%`}
            style={{
              width: 5, height: 32,
              background: 'var(--bg-secondary)', borderRadius: 3,
              overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse',
            }}
          >
            <div style={{ height: `${entry.scores?.[key] ?? 0}%`, background: color, borderRadius: 3 }} />
          </div>
        ))}
      </div>

      <button
        onClick={() => onDelete(index)}
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)',
          borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 12, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-muted)' }}
      >✕</button>
    </motion.div>
  )
}

/* ── Головний компонент ───────────────────────────────────── */
export default function MoodHistory() {
  const { t, i18n } = useTranslation()
  const history           = useMoodStore((s) => s.history)
  const clearHistory      = useMoodStore((s) => s.clearHistory)
  const deleteFromHistory = useMoodStore((s) => s.deleteFromHistory)

  const [activeTab, setActiveTab] = useState('radar')

  const headerRef = useScrollReveal()
  const bodyRef   = useScrollReveal()

  const last10 = history.slice(-10)

  const radarData = SCALE_META.map(({ key, labelKey }) => ({
    scale: t(labelKey),
    value: last10.length
      ? Math.round(last10.reduce((sum, e) => sum + (e.scores?.[key] ?? 0), 0) / last10.length)
      : 0,
  }))

  const lineData = last10.map((entry) => ({
    date: formatDate(entry.date, i18n.language === 'uk' ? 'uk-UA' : 'en-US'),
    ...entry.scores,
  }))

  const avgIndex = last10.length
    ? (last10.reduce((s, e) => s + (e.totalIndex ?? 0), 0) / last10.length).toFixed(1)
    : null

  /* Стиль таб-кнопок */
  const tabStyle = (tab) => ({
    padding: '8px 20px',
    borderRadius: 50,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    transition: 'all 0.25s',
    whiteSpace: 'nowrap',
    background: activeTab === tab ? 'var(--accent)' : 'var(--bg-secondary)',
    color:      activeTab === tab ? '#fff' : 'var(--text-secondary)',
  })

  return (
    <section id="history">
      <div className="container">

        <div ref={headerRef} className="text-center reveal">
          <div className="section-tag">{t('history.tag')}</div>
          <h2>{t('history.title')}</h2>
          <p className="section-desc">{t('history.desc')}</p>
        </div>

        <div ref={bodyRef} className="reveal" style={{ marginTop: 60 }}>

          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="history-empty"
            >
              <span>📊</span>
              <p>{t('history.empty_main')}</p>
              <p style={{ fontSize: 14, marginTop: 8, color: 'var(--text-muted)' }}>
                {t('history.empty_sub')}
              </p>
            </motion.div>
          ) : (
            <>
              {/* ── Статистика ──
                  ВАЖЛИВО: className="history-stats-grid" — керується через CSS,
                  тому адаптивність працює через медіа-запити (не inline style).
                  Десктоп: 3 колонки. Мобільний ≤600px: 2 колонки, остання span 2.
              ── */}
              <div className="history-stats-grid">
                {[
                  { label: t('history.stats.tests_count'), value: history.length,       emoji: '📋' },
                  { label: t('history.stats.avg_index'),   value: avgIndex ?? '—',      emoji: '📊' },
                  { label: t('history.stats.last_state'),  value: t(`mood.${history.at(-1)?.mood}`) ?? '—', emoji: MOOD_EMOJI[history.at(-1)?.mood] ?? '✨' },
                ].map(({ label, value, emoji }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -3 }}
                    className="history-stat-card"
                  >
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--accent)', lineHeight: 1.2 }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>
                      {label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Таб-перемикач ── */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <button style={tabStyle('radar')} onClick={() => setActiveTab('radar')}>
                  {t('history.tabs.radar')}
                </button>
                <button style={tabStyle('line')} onClick={() => setActiveTab('line')}>
                  {t('history.tabs.line')}
                </button>
              </div>

              {/* ── Графік ── */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
                borderRadius: 'var(--border-radius)', padding: '24px',
                marginBottom: 24, boxShadow: 'var(--card-shadow)',
                overflow: 'hidden',   /* запобігає виходу графіка за межі */
              }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'radar' ? (
                    <motion.div
                      key="radar"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>
                        {t('history.chart_title')}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                        {t('history.chart_desc', { count: last10.length })}
                      </p>
                      <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="var(--bg-card-border)" />
                          <PolarAngleAxis
                            dataKey="scale"
                            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Radar
                            name={t('history.radar_name')}
                            dataKey="value"
                            stroke="var(--accent)"
                            fill="var(--accent)"
                            fillOpacity={0.25}
                            strokeWidth={2.5}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, t('history.value_label')]}
                            contentStyle={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--bg-card-border)',
                              borderRadius: 10, fontSize: 13,
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="line"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>
                        {t('history.line_title')}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                        {t('history.line_desc')}
                      </p>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={lineData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-card-border)" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            axisLine={{ stroke: 'var(--bg-card-border)' }}
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            axisLine={{ stroke: 'var(--bg-card-border)' }}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            formatter={(v) => t(SCALE_META.find(s => s.key === v)?.labelKey) ?? v}
                            wrapperStyle={{ fontSize: 12 }}
                          />
                          {SCALE_META.map(({ key, color }) => (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              stroke={color}
                              strokeWidth={2}
                              dot={{ fill: color, r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Список записів ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <AnimatePresence>
                  {[...history].reverse().map((entry, i) => (
                    <HistoryCard
                      key={entry.date + i}
                      entry={entry}
                      index={history.length - 1 - i}
                      onDelete={deleteFromHistory}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* ── Очистити ── */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'transparent', border: '2px solid var(--bg-card-border)',
                    borderRadius: 50, padding: '11px 26px', fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-card-border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {t('history.clear_btn')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}