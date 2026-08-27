import { clearAuthTokens, request, setAuthTokens } from './client'

export async function loginWithOAuth(provider, accessToken) {
  const response = await request(`/api/auth/login/${provider}`, {
    method: 'POST',
    body: { accessToken },
  })
  const authData = response.data

  if (!authData?.accessToken || !authData?.refreshToken) {
    throw new Error(response.message || '로그인 응답에 인증 토큰이 없습니다.')
  }

  // 약관 동의 전까지는 토큰을 저장하지 않아 로그인 상태로 취급되지 않도록 한다.
  if (!authData.needsTermsAgreement) {
    setAuthTokens(authData)
  }

  return authData
}

export async function logoutFromServer() {
  try {
    return await request('/api/auth/logout', {
      method: 'POST',
    })
  } finally {
    clearAuthTokens()
  }
}

export async function getMyInfo() {
  return request('/api/users/me')
}

export async function withdrawFromServer() {
  const response = await request('/api/users/me', {
    method: 'DELETE',
  })

  clearAuthTokens()
  return response
}