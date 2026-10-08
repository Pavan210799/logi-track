import { CircleAlert, Inbox } from 'lucide-react'

export function ErrorState({ text, onRetry }) {
  return (
    <div className="grid min-h-70 place-content-center justify-items-center gap-3 rounded-2xl bg-surface p-6 text-center shadow-card">
      <CircleAlert size={32} className="text-red-500" />
      <p className="font-semibold text-red-600">{text}</p>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-sand"
      >
        Try again
      </button>
    </div>
  )
}

export function EmptyState({ title, text }) {
  return (
    <div className="grid place-content-center justify-items-center gap-2 rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-sand-dark text-accent">
        <Inbox size={22} />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-gray-500">{text}</p>
    </div>
  )
}
