const variants = {
  primary: 'shine bg-linear-to-br from-burgundy-light to-burgundy text-white shadow-sm hover:shadow-glow',
  secondary: 'border border-line bg-surface text-gray-700 hover:border-burgundy/25 hover:bg-sand hover:shadow-sm',
  danger: 'shine bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25',
  success: 'shine bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25',
  warning: 'shine bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25',
}

function Button({ variant, type, form, disabled, onClick, children }) {
  const style = variants[variant] || variants.primary

  return (
    <button
      type={type || 'button'}
      form={form}
      disabled={disabled}
      onClick={onClick}
      className={
        'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 ' +
        style
      }
    >
      {children}
    </button>
  )
}

export default Button
