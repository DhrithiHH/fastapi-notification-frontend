import api from './axios'

export async function getNotificationEvents() {
  const { data } = await api.get('/api/v1/notifications')
  return data
}
