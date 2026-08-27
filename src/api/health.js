import { request } from './client'

export async function getHealthStatus() {
  const response = await request('/api/health')

  return response.data
}