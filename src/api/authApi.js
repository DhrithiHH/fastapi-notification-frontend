import api from './axios'

export async function login(username, password) {
  const body = new URLSearchParams({ username, password })
  const { data } = await api.post('/api/v1/token/access', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}
