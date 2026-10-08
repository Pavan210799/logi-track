import { useEffect } from 'react'
import { X } from 'lucide-react'
import { getScrollArea } from '../../utils/scroll.js'

function Modal({ title, subtitle, size, onClose, footer, children }) {
  // Stop the page behind from scrolling, and close on Escape
  useEffect(
    function () {
      function handleKey(event) {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      const scrollArea = getScrollArea()
      scrollArea.style.overflowY = 'hidden'
      window.addEventListener('keydown', handleKey)

      return function () {
        scrollArea.style.overflowY = ''
        window.removeEventListener('keydown', handleKey)
      }
    },
    [onClose],
  )

  const width = size === 'large' ? 'sm:max-w-3xl' : 'sm:max-w-xl'

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-gray-950/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={function (event) {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={
          'flex max-h-[92dvh] w-full animate-slide-up flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl sm:animate-scale-in sm:rounded-2xl ' + width
        }
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-gray-500 transition duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-line bg-sand px-5 py-3 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

export default Modal
