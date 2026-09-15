import { useState } from 'react'
import type { ComponentType } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ServerStateLesson from './lesson/01-server-state/ServerStateLesson'
import FirstQueryLesson from './lesson/02-first-query/FirstQueryLesson'
import QueryKeyLesson from './lesson/03-query-key-and-cache/QueryKeyLesson'
import PaginationLesson from './lesson/04-pagination/PaginationLesson'
import CreateMutationLesson from './lesson/05-create-mutation/CreateMutationLesson'
import OptimisticUiLesson from './lesson/08-optimistic-ui/OptimisticUiLesson'

type LessonItem = {
  label: string
  component: ComponentType
}

// Tambahkan lesson yang sudah selesai ke array ini saat live coding.
const lessons: LessonItem[] = [
  { label: '01 · Client vs server', component: ServerStateLesson },
  { label: '02 · useQuery pertama', component: FirstQueryLesson },
  { label: '03 · Key dan cache', component: QueryKeyLesson },
  { label: '04 · Pagination', component: PaginationLesson },
  { label: '05 · POST mutation', component: CreateMutationLesson },
  // { label: '06 · PUT, DELETE, invalidation', component: UpdateDeleteLesson },
  // { label: '07 · Infinite query · bonus', component: InfiniteQueryLesson },
  { label: '08 · Optimistic UI', component: OptimisticUiLesson },
]

export default function App() {
  const [activeLesson, setActiveLesson] = useState(0)
  const [showDevtools, setShowDevtools] = useState(false)
  const ActiveLesson = lessons[activeLesson]?.component

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <p className="font-semibold text-indigo-700">Henry Rivardo · Software engineer</p>
        <h1>Meet 22 — React Query</h1>
        <p>Server State · Product Explorer + Sociality Optimistic UI</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Navigasi lesson" className="card space-y-2 lg:sticky lg:top-6">
          <p className="mb-3 text-sm font-semibold">ALUR BELAJAR</p>
          {lessons.map((lesson, index) => (
            <button
              className="nav-button"
              aria-current={activeLesson === index ? 'page' : undefined}
              key={lesson.label}
              onClick={() => setActiveLesson(index)}
            >
              {lesson.label}
            </button>
          ))}
          {lessons.length === 0 && (
            <p className="text-sm text-slate-500">Lesson akan ditambahkan saat kelas.</p>
          )}

          {import.meta.env.DEV && (
            <label className="mt-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDevtools}
                onChange={(event) => setShowDevtools(event.target.checked)}
              />
              Aktifkan Query Devtools
            </label>
          )}
        </nav>

        <main className="min-w-0">
          {ActiveLesson ? (
            <ActiveLesson />
          ) : (
            <section className="card space-y-4">
              <p className="font-semibold text-indigo-700">Boilerplate siap</p>
              <h2>Mulai live coding dari lesson 01</h2>
              <p>
                Buat component di folder lesson, import ke App.tsx, lalu aktifkan satu
                baris pada array lessons.
              </p>
            </section>
          )}
        </main>
      </div>

      {import.meta.env.DEV && showDevtools && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </div>
  )
}
