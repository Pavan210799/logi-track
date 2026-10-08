import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, LockKeyhole, Mail, User, UserPlus } from 'lucide-react'
import { signup } from '../api/auth.js'
import { isValidEmail, passwordError } from '../utils/authValidation.js'
import AuthInput from '../components/auth/AuthInput.jsx'
import { AuthButton, AuthHeading, FormAlert, PasswordStrength } from '../components/auth/AuthParts.jsx'

const emptyForm = { name: '', email: '', password: '', confirm: '' }

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [errorCount, setErrorCount] = useState(0)
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your full name.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address.'
    const passwordProblem = passwordError(form.password)
    if (passwordProblem) nextErrors.password = passwordProblem
    if (!form.confirm) nextErrors.confirm = 'Confirm your password.'
    else if (form.confirm !== form.password) nextErrors.confirm = 'Passwords do not match.'
    if (!agreed) nextErrors.agreed = 'Please accept the terms to continue.'
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/signup-success', { replace: true })
    } catch (err) {
      setFormError(err.message)
      setErrorCount(errorCount + 1)
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeading icon={UserPlus} title="Create your account" subtitle="Start tracking your fleet in under a minute." />

      {formError && (
        <FormAlert key={errorCount} type="error">
          {formError}
        </FormAlert>
      )}

      <form noValidate onSubmit={handleSubmit} className="stagger grid gap-4">
        <AuthInput
          id="signup-name"
          name="name"
          label="Full name"
          icon={User}
          autoComplete="name"
          placeholder="Ananya Sharma"
          value={form.name}
          error={errors.name}
          onChange={updateField}
        />
        <AuthInput
          id="signup-email"
          name="email"
          label="Work email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          error={errors.email}
          onChange={updateField}
        />
        <AuthInput
          id="signup-password"
          name="password"
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.password}
          error={errors.password}
          onChange={updateField}
        />
        <PasswordStrength password={form.password} />
        <AuthInput
          id="signup-confirm"
          name="confirm"
          label="Confirm password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirm}
          error={errors.confirm}
          onChange={updateField}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-600 select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={function (event) {
                setAgreed(event.target.checked)
              }}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-burgundy"
            />
            <span>
              I agree to the <span className="font-semibold text-accent">Terms of Service</span> and{' '}
              <span className="font-semibold text-accent">Privacy Policy</span>
            </span>
          </label>
          {errors.agreed && <p className="mt-1.5 animate-fade-down text-xs font-medium text-red-600">{errors.agreed}</p>}
        </div>

        <AuthButton loading={loading} loadingLabel="Creating account...">
          Create account
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent transition hover:text-burgundy-light hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}

export default Signup
