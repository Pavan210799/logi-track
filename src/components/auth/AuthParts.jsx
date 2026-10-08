import { AlertCircle, ArrowRight, CircleCheck, Loader2 } from 'lucide-react'
import { passwordScore } from '../../utils/authValidation.js'

export function AuthHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <span className="grid h-12 w-12 animate-pop-in place-items-center rounded-2xl bg-burgundy/10 text-accent ring-1 ring-burgundy/15">
        <Icon size={22} />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

export function AuthButton({ loading, loadingLabel, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="shine group inline-flex h-11.5 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-br from-burgundy-light to-burgundy text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-85"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : null}
      {loading ? loadingLabel : children}
      {!loading && <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />}
    </button>
  )
}

// Error shakes in, success fades in; change the key to replay the shake
export function FormAlert({ type, children }) {
  const isError = type === 'error'
  const Icon = isError ? AlertCircle : CircleCheck
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={
        'mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium ' +
        (isError ? 'animate-shake border-red-200 bg-red-50 text-red-700' : 'animate-fade-down border-emerald-200 bg-emerald-50 text-emerald-700')
      }
    >
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

const strengthLevels = [
  { label: 'Too weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Fair', bar: 'bg-amber-500', text: 'text-amber-600' },
  { label: 'Good', bar: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'Strong', bar: 'bg-emerald-600', text: 'text-emerald-600' },
]

export function PasswordStrength({ password }) {
  if (!password) {
    return null
  }
  const score = passwordScore(password)
  const level = strengthLevels[score]
  return (
    <div className="-mt-2 flex animate-fade-down items-center gap-3">
      <div className="grid flex-1 grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map(function (step) {
          return (
            <span key={step} className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <span
                className={'block h-full rounded-full transition-all duration-500 ' + level.bar}
                style={{ width: score >= step ? '100%' : '0%' }}
              ></span>
            </span>
          )
        })}
      </div>
      <span className={'w-16 text-right text-xs font-semibold ' + level.text}>{level.label}</span>
    </div>
  )
}

const particles = [
  { x: '-46px', y: '-30px', color: 'bg-amber-400' },
  { x: '44px', y: '-36px', color: 'bg-burgundy' },
  { x: '52px', y: '18px', color: 'bg-emerald-400' },
  { x: '-50px', y: '22px', color: 'bg-burgundy' },
  { x: '-12px', y: '-56px', color: 'bg-emerald-400' },
  { x: '18px', y: '54px', color: 'bg-amber-400' },
  { x: '-30px', y: '48px', color: 'bg-amber-300' },
  { x: '30px', y: '-54px', color: 'bg-rose-400' },
]

// Green check that draws itself, with a soft pulse and a small burst of dots
export function SuccessCheck() {
  return (
    <div className="relative mx-auto grid h-28 w-28 place-items-center">
      <span className="absolute inset-2 animate-ping-soft rounded-full bg-emerald-400/20"></span>
      <span className="absolute inset-4 rounded-full bg-emerald-500/15"></span>
      {particles.map(function (particle) {
        return (
          <span
            key={particle.x + particle.y}
            className={'absolute top-1/2 left-1/2 h-2 w-2 animate-burst rounded-full ' + particle.color}
            style={{ '--burst-x': particle.x, '--burst-y': particle.y }}
          ></span>
        )
      })}
      <svg viewBox="0 0 52 52" className="relative h-18 w-18 animate-pop-in drop-shadow-lg">
        <circle cx="26" cy="26" r="24" className="fill-emerald-500" />
        <path
          d="M15 27l7.5 7.5L38 19"
          fill="none"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="animate-draw"
        />
      </svg>
    </div>
  )
}
