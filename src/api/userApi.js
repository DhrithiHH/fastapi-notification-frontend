import api from './axios'

export async function registerUser(payload) {
  const { data } = await api.post('/api/v1/users', payload)
  return data
}

export async function getCurrentUser() {
  const { data } = await api.get('/api/v1/users')
  return data
}

export async function updateUser(payload) {
  const { data } = await api.patch('/api/v1/users', payload)
  return data
}

export async function deleteUser(password) {
  const { data } = await api.delete('/api/v1/users', { data: { password } })
  return data
}
