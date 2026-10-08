import { ChevronLeft, ChevronRight } from 'lucide-react'

const arrowButton =
  'flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-gray-700 transition duration-200 hover:-translate-y-0.5 hover:border-burgundy/30 hover:text-accent hover:shadow-sm disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:text-gray-700'

function Pagination({ page, totalPages, onChange }) {
  // Page numbers like [1, 2, 3]
  const pageNumbers = []
  for (let number = 1; number <= totalPages; number++) {
    pageNumbers.push(number)
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={arrowButton}
          disabled={page === 1}
          onClick={function () {
            onChange(page - 1)
          }}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbers on bigger screens, '2 / 5' on phones */}
        <div className="hidden flex-wrap items-center justify-center gap-1.5 sm:flex">
          {pageNumbers.map(function (number) {
            const isActive = number === page
            return (
              <button
                key={number}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                className={
                  'grid h-9 min-w-9 cursor-pointer place-items-center rounded-lg px-2 text-sm font-semibold transition duration-200 ' +
                  (isActive
                    ? 'scale-105 bg-linear-to-br from-burgundy-light to-burgundy text-white shadow-glow'
                    : 'border border-line bg-surface text-gray-600 hover:-translate-y-0.5 hover:border-burgundy/30 hover:text-accent hover:shadow-sm')
                }
                onClick={function () {
                  onChange(number)
                }}
              >
                {number}
              </button>
            )
          })}
        </div>
        <span className="px-2 text-sm font-semibold text-gray-700 sm:hidden">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          className={arrowButton}
          disabled={page === totalPages}
          onClick={function () {
            onChange(page + 1)
          }}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
