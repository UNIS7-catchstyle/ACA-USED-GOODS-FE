import { request } from './client'

export async function agreeToTerms({ requiredAgreed, marketingEmailAgreed, marketingSnsAgreed }) {
  return request('/api/users/me/terms', {
    method: 'POST',
    body: { requiredAgreed, marketingEmailAgreed, marketingSnsAgreed },
  })
}
