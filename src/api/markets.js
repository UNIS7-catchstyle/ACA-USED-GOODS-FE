import { request } from './client'

export async function getMarketDetail(marketId, { signal } = {}) {
  return request(`/api/markets/${marketId}`, { signal })
}

export async function createMarket({ category, title, itemCategories, description, imageUrls = [] } = {}) {
  return request('/api/markets', {
    method: 'POST',
    body: { category, title, itemCategories, description, imageUrls },
  })
}

export async function updateMarket(marketId, { category, title, itemCategories, description, imageUrls = [], isClosed } = {}) {
  return request(`/api/markets/${marketId}`, {
    method: 'PUT',
    body: { category, title, itemCategories, description, imageUrls, isClosed },
  })
}

export async function createComment(marketId, { content, imageUrl, parentId } = {}) {
  return request(`/api/markets/${marketId}/comments`, {
    method: 'POST',
    body: { content, imageUrl, parentId },
  })
}

export async function getComments(marketId, { signal } = {}) {
  return request(`/api/markets/${marketId}/comments`, { signal })
}

export async function getMarkets({ category, excludeClosed = false, cursor, size = 20, signal } = {}) {
  const params = new URLSearchParams({
    category,
    excludeClosed: String(excludeClosed),
    size: String(size),
  })

  if (cursor) params.set('cursor', cursor)

  return request(`/api/markets?${params.toString()}`, { signal })
}

export async function getScrappedMarkets({ category, excludeClosed = false, cursor, size = 20, signal } = {}) {
  const params = new URLSearchParams({
    excludeClosed: String(excludeClosed),
    size: String(size),
  })

  if (category) params.set('category', category)
  if (cursor) params.set('cursor', cursor)

  return request(`/api/users/me/scraps?${params.toString()}`, { signal })
}

export async function scrapMarket(marketId) {
  return request(`/api/markets/${marketId}/scrap`, {
    method: 'POST',
  })
}

export async function unscrapMarket(marketId) {
  return request(`/api/markets/${marketId}/scrap`, {
    method: 'DELETE',
  })
}

export async function getMyMarket({ signal } = {}) {
  return request('/api/users/me/markets', { signal })
}

export async function getMarketRegistrationStatus({ signal } = {}) {
  return request('/api/markets/registration-status', { signal })
}

export async function getCommentedMarkets({ excludeClosed = false, cursor, size = 20, signal } = {}) {
  const params = new URLSearchParams({
    excludeClosed: String(excludeClosed),
    size: String(size),
  })

  if (cursor) params.set('cursor', cursor)

  return request(`/api/users/me/commented-markets?${params.toString()}`, { signal })
}
