import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { readLastSignup } from '../api/auth.js'
import { SuccessCheck } from '../components/auth/AuthParts.jsx'

const readyItems = ['Account created', 'Fleet workspace set up', 'Live tracking and alerts enabled']

function SignupSuccess() {
  const account = readLastSignup()

  if (!account) {
    return <Navigate to="/signup" replace />
  }

  const firstName = account.name.split(' ')[0]

  return (
    <div className="text-center">
      <SuccessCheck />

      <h1 className="mt-5 animate-fade-up text-2xl font-extrabold tracking-tight">Welcome aboard, {firstName}!</h1>
      <p className="mt-2 animate-fade-up text-sm text-gray-500 [animation-delay:80ms]">
        Your LogiTrack account for <span className="font-semibold break-all text-gray-800">{account.email}</span> is ready.
      </p>

      <ul className="stagger mt-6 grid gap-2.5 rounded-2xl border border-line bg-sand p-4 text-left">
        {readyItems.map(function (item) {
          return (
            <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
              <CircleCheck size={18} className="shrink-0 text-emerald-600" />
              {item}
            </li>
          )
        })}
      </ul>

      <Link
        to={'/login?welcome=1&email=' + encodeURIComponent(account.email)}
        className="shine group mt-6 inline-flex h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-burgundy-light to-burgundy text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-glow"
      >
        Continue to sign in
        <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>

      <p className="mt-5 text-sm text-gray-500">
        Not you?{' '}
        <Link to="/signup" className="font-semibold text-accent transition hover:text-burgundy-light hover:underline">
          Create another account
        </Link>
      </p>
    </div>
  )
}

export default SignupSuccess
