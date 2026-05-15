import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMoodStore = create(
  persist(
    (set) => ({

      /* ── Поточна тема ──────────────────────────────────── */
      currentMood: 'neutral',
      setMood: (mood) => set({ currentMood: mood }),

      /* ── Стан модального квізу ─────────────────────────── */
      quizOpen: false,
      openQuiz:  () => set({ quizOpen: true }),
      closeQuiz: () => set({ quizOpen: false }),

      /* ── Останній результат тесту (для hero-карточки) ──── */
      // null = тест ще не проходився, показуємо дефолтні дані теми
      lastResult: null,
      setLastResult: (result) => set({ lastResult: result }),

      /* ── Історія результатів (для графіка динаміки) ─────── */
      // Кожен запис: { date, mood, scores, totalIndex }
      history: [],
      addToHistory: (entry) =>
        set((state) => ({
          history: [
            ...state.history,
            { ...entry, date: new Date().toISOString() },
          ],
        })),
      clearHistory: () => set({ history: [] }),

    }),
    {
      name: 'moodflow-storage', // ключ у localStorage
    }
  )
)