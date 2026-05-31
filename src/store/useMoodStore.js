import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMoodStore = create(
  persist(
    (set) => ({

      currentMood: 'neutral',
      setMood: (mood) => set({ currentMood: mood }),

      /*стан модального квізу*/
      quizOpen: false,
      openQuiz:  () => set({ quizOpen: true }),
      closeQuiz: () => set({ quizOpen: false }),

      /*останній результат тесту (для hero-карточки)*/
      //null = тест ще не проходився, показуємо дефолтні дані теми
      lastResult: null,
      setLastResult: (result) => set({ lastResult: result }),

      /*історія результатів для графіка динаміки */
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
      name: 'moodflow-storage', //ключ у localStorage
    }
  )
)