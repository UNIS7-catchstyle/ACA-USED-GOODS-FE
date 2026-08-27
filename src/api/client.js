const DEFAULT_API_BASE_URL = 'https://aca-used-goods-be-production.up.railway.app'
const ACCESS_TOKEN_KEY = 'aca-goods-access-token'
const REFRESH_TOKEN_KEY = 'aca-goods-refresh-token'
let reissuePromise = null

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function sendRequest(path, options = {}) {
  const { body, headers, ...fetchOptions } = options
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  const requestHeaders = new Headers(headers)

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
  })

  return response
}

async function readResponse(response) {
  const contentType = response.headers.get('content-type') || ''

  return contentType.includes('application/json')
    ? response.json()
    : response.text()
}

export async function request(path, options = {}) {
  const { skipTokenReissue = false, ...requestOptions } = options
  let response = await sendRequest(path, requestOptions)

  if (response.status === 401 && !skipTokenReissue) {
    await reissueAuthTokens()
    response = await sendRequest(path, requestOptions)
  }

  const data = await readResponse(response)

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message
      ? data.message
      : `API request failed with status ${response.status}`
    throw new ApiError(message, response.status, data)
  }

  return data
}

export async function uploadImages(files) {
  const formData = new FormData()

  files.forEach((file) => formData.append('files', file))

  const response = await request('/api/images', {
    method: 'POST',
    body: formData,
  })

  return response.data?.urls || []
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setRefreshToken(token) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

export function setAuthTokens({ accessToken, refreshToken }) {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}

export function clearAuthTokens() {
  setAccessToken(null)
  setRefreshToken(null)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export async function reissueAuthTokens() {
  if (reissuePromise) {
    return reissuePromise
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearAuthTokens()
    throw new ApiError('로그인 정보가 만료되었습니다.', 401)
  }

  reissuePromise = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await readResponse(response)

    if (!response.ok) {
      const message = typeof data === 'object' && data?.message
        ? data.message
        : '로그인 정보가 만료되었습니다.'
      throw new ApiError(message, response.status, data)
    }

    const authData = data?.data
    if (!authData?.accessToken || !authData?.refreshToken) {
      throw new ApiError('토큰 재발급 응답에 인증 토큰이 없습니다.', response.status, data)
    }

    setAuthTokens(authData)
    return authData
  })()

  try {
    return await reissuePromise
  } catch (error) {
    clearAuthTokens()
    throw error
  } finally {
    reissuePromise = null
  }
}