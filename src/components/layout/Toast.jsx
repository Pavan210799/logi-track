import { useEffect } from 'react'
import { CircleAlert, CircleCheck, X } from 'lucide-react'

// Small message that hides itself after a few seconds
function Toast({ toast, onClose }) {
  useEffect(
    function () {
      const timer = setTimeout(onClose, 3500)
      return function () {
        clearTimeout(timer)
      }
    },
    [toast, onClose],
  )

  const isError = toast.type === 'error'

  return (
    <div className="fixed top-4 right-4 left-4 z-[60] flex justify-center sm:left-auto">
      <div
        role="status"
        className={
          'flex w-full max-w-sm animate-fade-down items-start gap-3 rounded-xl border bg-surface p-3.5 shadow-xl ' +
          (isError ? 'border-red-200' : 'border-emerald-200')
        }
      >
        <span className={isError ? 'text-red-600' : 'text-emerald-600'}>
          {isError ? <CircleAlert size={20} /> : <CircleCheck size={20} />}
        </span>
        <p className="flex-1 text-sm font-medium text-gray-700">{toast.message}</p>
        <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
