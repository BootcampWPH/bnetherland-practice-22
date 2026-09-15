import type { ReactNode } from 'react'

type Props = {
  title: string
  goal: string
  explanation: string
  tasks: string[]
  aha: string
  children: ReactNode
}
export default function LessonLayout({
  title,
  goal,
  explanation,
  tasks,
  aha,
  children,
}: Props) {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h2>{title}</h2>
        <p className="font-semibold">Tujuan: {goal}</p>
        <p>{explanation}</p>
      </header>
      <div className="card space-y-5">{children}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <aside className="card">
          <h3>Coba lakukan</h3>
          <ul className="list-disc space-y-2 pl-5">
            {tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </aside>
        <aside className="card">
          <h3>AHA moment</h3>
          <p>{aha}</p>
        </aside>
      </div>
    </section>
  )
}
