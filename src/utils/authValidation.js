export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

// 0 to 4: length, mixed case, a number, a symbol
export function passwordScore(password) {
  let score = 0
  if (password.length >= 6) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export function passwordError(password) {
  if (!password) return 'Enter a password.'
  if (password.length < 6) return 'Use at least 6 characters.'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Use both letters and numbers.'
  return ''
}

export function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(function (word) {
      return word[0].toUpperCase()
    })
    .join('')
}
