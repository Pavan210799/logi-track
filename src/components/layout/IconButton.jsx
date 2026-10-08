function IconButton({ label, danger, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={
        'grid h-8.5 w-8.5 cursor-pointer place-items-center rounded-lg border border-transparent transition duration-200 hover:scale-110 active:scale-95 ' +
        (danger
          ? 'text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600'
          : 'text-gray-500 hover:border-line hover:bg-sand hover:text-accent')
      }
    >
      {children}
    </button>
  )
}

export default IconButton
