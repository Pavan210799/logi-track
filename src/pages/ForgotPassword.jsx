import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, KeyRound, Lock, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { findAccount, resetPassword } from '../api/auth.js'
import { isValidEmail, passwordError } from '../utils/authValidation.js'
import AuthInput from '../components/auth/AuthInput.jsx'
import { AuthButton, AuthHeading, FormAlert, PasswordStrength, SuccessCheck } from '../components/auth/AuthParts.jsx'

const steps = ['Find account', 'New password', 'Done']

// The step and email live in the URL, so a reload stays on the same step
function ForgotPassword() {
  const [searchParams, setSearchParams] = useSearchParams()
  const savedEmail = searchParams.get('email') || ''
  const urlStep = searchParams.get('step')
  const step = savedEmail && (urlStep === 'reset' || urlStep === 'done') ? urlStep : 'email'
  const stepIndex = step === 'email' ? 0 : step === 'reset' ? 1 : 2

  const [email, setEmail] = useState(savedEmail)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [loading, setLoading] = useState(false)

  function showError(message) {
    setFormError(message)
    setErrorCount(errorCount + 1)
    setLoading(false)
  }

  async function handleFindAccount(event) {
    event.preventDefault()
    setFormError('')
    if (!isValidEmail(email)) {
      setErrors({ email: 'Enter a valid email address.' })
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await findAccount(email)
      setLoading(false)
      setSearchParams({ step: 'reset', email: email.trim().toLowerCase() })
    } catch (err) {
      showError(err.message)
    }
  }

  async function handleReset(event) {
    event.preventDefault()
    setFormError('')
    const nextErrors = {}
    const passwordProblem = passwordError(password)
    if (passwordProblem) nextErrors.password = passwordProblem
    if (!confirm) nextErrors.confirm = 'Confirm your new password.'
    else if (confirm !== password) nextErrors.confirm = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }
    setLoading(true)
    try {
      await resetPassword(savedEmail, password)
      setLoading(false)
      setSearchParams({ step: 'done', email: savedEmail })
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-2">
        {steps.map(function (label, index) {
          return (
            <div key={label}>
              <span className="block h-1.5 overflow-hidden rounded-full bg-gray-100">
                <span
                  className="block h-full rounded-full bg-linear-to-r from-burgundy-light to-burgundy transition-all duration-500"
                  style={{ width: index <= stepIndex ? '100%' : '0%' }}
                ></span>
              </span>
              <span className={'mt-1.5 block truncate text-[0.68rem] font-semibold ' + (index <= stepIndex ? 'text-accent' : 'text-gray-400')}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {formError && (
        <FormAlert key={errorCount} type="error">
          {formError}
        </FormAlert>
      )}

      <div key={step} className="animate-fade-up">
        {step === 'email' && (
          <>
            <AuthHeading icon={KeyRound} title="Forgot your password?" subtitle="Enter the email on your account and we will help you set a new one." />
            <form noValidate onSubmit={handleFindAccount} className="grid gap-4">
              <AuthInput
                id="forgot-email"
                label="Email"
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                error={errors.email}
                onChange={function (event) {
                  setEmail(event.target.value)
                }}
              />
              <AuthButton loading={loading} loadingLabel="Checking...">
                Continue
              </AuthButton>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <AuthHeading icon={ShieldCheck} title="Set a new password" subtitle={'Choose a strong password for ' + savedEmail + '.'} />
            <form noValidate onSubmit={handleReset} className="grid gap-4">
              <AuthInput
                id="reset-password"
                label="New password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                error={errors.password}
                onChange={function (event) {
                  setPassword(event.target.value)
                }}
              />
              <PasswordStrength password={password} />
              <AuthInput
                id="reset-confirm"
                label="Confirm new password"
                icon={LockKeyhole}
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={confirm}
                error={errors.confirm}
                onChange={function (event) {
                  setConfirm(event.target.value)
                }}
              />
              <AuthButton loading={loading} loadingLabel="Updating...">
                Update password
              </AuthButton>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <SuccessCheck />
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Password updated</h1>
            <p className="mt-2 text-sm text-gray-500">You can now sign in to LogiTrack with your new password.</p>
            <Link
              to={'/login?reset=1&email=' + encodeURIComponent(savedEmail)}
              className="shine group mt-6 inline-flex h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-burgundy-light to-burgundy text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-glow"
            >
              Back to sign in
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {step !== 'done' && (
        <Link
          to="/login"
          className="group mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-accent"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to sign in
        </Link>
      )}
    </>
  )
}

export default ForgotPassword
