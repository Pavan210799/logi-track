import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Input with a leading icon, an optional link beside the label and a show/hide toggle for passwords
function AuthInput({ id, label, icon: Icon, error, labelAction, type = 'text', ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-[0.8rem] font-semibold text-gray-700">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="group relative">
        <Icon
          size={17}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 transition group-focus-within:text-accent"
        />
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={Boolean(error)}
          className={
            'h-11.5 w-full min-w-0 rounded-xl border bg-surface pl-10.5 text-sm outline-none transition placeholder:text-gray-400 hover:border-burgundy/30 focus:border-burgundy focus:ring-4 focus:ring-burgundy/10 ' +
            (isPassword ? 'pr-11 ' : 'pr-3.5 ') +
            (error ? 'border-red-400' : 'border-line')
          }
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={function () {
              setVisible(!visible)
            }}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-1.5 grid h-8.5 w-8.5 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-gray-400 transition hover:bg-sand hover:text-accent"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <span className="animate-fade-down text-xs font-medium text-red-600">{error}</span>}
    </div>
  )
}

export default AuthInput
