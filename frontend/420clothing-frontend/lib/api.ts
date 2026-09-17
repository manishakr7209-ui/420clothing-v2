const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// ===== PRODUCTS =====
export const getProducts = (params?: Record<string, string>) => {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchAPI(`/products${query}`)
}

export const getProductBySlug = (slug: string) =>
  fetchAPI(`/products/${slug}`)

// ===== CATEGORIES =====
export const getCategories = () => fetchAPI('/categories')

// ===== AUTH =====
export const loginUser = (email: string, password: string) =>
  fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const registerUser = (data: {
  name: string
  email: string
  phone: string
  password: string
}) =>
  fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getProfile = (token: string) =>
  fetchAPI('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })

// ===== ORDERS =====
export const createOrder = (data: any, token: string) =>
  fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })

export const getMyOrders = (token: string) =>
  fetchAPI('/orders/my-orders', {
    headers: { Authorization: `Bearer ${token}` },
  })
