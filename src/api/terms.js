import { request } from './client'

export async function agreeToTerms({ requiredAgreed, marketingEmailAgreed, marketingSnsAgreed, accessToken }) {
  return request('/api/users/me/terms', {
    method: 'POST',
    body: { requiredAgreed, marketingEmailAgreed, marketingSnsAgreed },
    ...(accessToken !== undefined ? { accessToken, skipTokenReissue: true } : {}),
  })
}
