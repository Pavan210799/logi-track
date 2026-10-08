// Same look for every input, select, and textarea
export const inputClass =
  'h-10 w-full min-w-0 rounded-lg border border-line bg-surface px-3 text-sm outline-none transition hover:border-burgundy/30 focus:border-burgundy focus:ring-4 focus:ring-burgundy/10 disabled:bg-gray-50 disabled:text-gray-500'

function FormField({ label, error, hint, wide, children }) {
  return (
    <label className={'flex min-w-0 flex-col gap-1.5 ' + (wide ? 'sm:col-span-2' : '')}>
      <span className="text-[0.8rem] font-semibold text-gray-700">{label}</span>
      {children}
      {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export default FormField
