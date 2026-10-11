const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function apiRequest(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    })
  } catch (networkError) {
    throw new Error('Network error: unable to reach server')
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(
      typeof data === 'string'
        ? data || `Request failed: ${response.status}`
        : data.message || `Request failed: ${response.status}`
    )
  }

  return data
}