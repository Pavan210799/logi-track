import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Lock, LogIn, Mail } from 'lucide-react'
import { login } from '../api/auth.js'
import { isValidEmail } from '../utils/authValidation.js'
import AuthInput from '../components/auth/AuthInput.jsx'
import { AuthButton, AuthHeading, FormAlert } from '../components/auth/AuthParts.jsx'

function Login() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [loading, setLoading] = useState(false)

  let notice = ''
  if (searchParams.get('reset') === '1') {
    notice = 'Password updated. Sign in with your new password.'
  } else if (searchParams.get('welcome') === '1') {
    notice = 'Your account is ready. Sign in to get started.'
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = 'Enter your password.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      // On success the auth layout sends the user into the app
      await login(email, password, remember)
    } catch (err) {
      setFormError(err.message)
      setErrorCount(errorCount + 1)
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeading icon={LogIn} title="Welcome back" subtitle="Sign in to manage your fleet, drivers and shipments." />

      {formError && (
        <FormAlert key={errorCount} type="error">
          {formError}
        </FormAlert>
      )}
      {!formError && notice && <FormAlert type="success">{notice}</FormAlert>}

      <form noValidate onSubmit={handleSubmit} className="stagger grid gap-4">
        <AuthInput
          id="login-email"
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
        <AuthInput
          id="login-password"
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          error={errors.password}
          labelAction={
            <Link to="/forgot-password" className="text-xs font-semibold text-accent transition hover:text-burgundy-light hover:underline">
              Forgot password?
            </Link>
          }
          onChange={function (event) {
            setPassword(event.target.value)
          }}
        />

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={function (event) {
              setRemember(event.target.checked)
            }}
            className="h-4 w-4 cursor-pointer rounded accent-burgundy"
          />
          Keep me signed in
        </label>

        <AuthButton loading={loading} loadingLabel="Signing in...">
          Sign in
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to LogiTrack?{' '}
        <Link to="/signup" className="font-semibold text-accent transition hover:text-burgundy-light hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}

export default Login
