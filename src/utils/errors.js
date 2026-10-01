export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = error.response?.status
  const body = error.response?.data

  if (status === 400) return Array.isArray(body?.detail) ? body.detail.join(' ') : 'Please check the information you entered and try again.'
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return body?.message || 'You do not have permission to complete this action.'
  if (status === 404) return body?.message || 'We could not find that account.'
  if (status === 409) return 'An account with this username or email already exists.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status === 500) return 'Something went wrong on the server. Please try again.'
  if (status === 503) return 'A required service is temporarily unavailable. Please try again shortly.'
  if (!error.response) return 'Unable to reach the server. Check that the backend is running and try again.'
  return body?.message || fallback
}
