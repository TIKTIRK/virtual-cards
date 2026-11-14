import { ApiError } from './errors.js'

const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

const cookie = name =>
	document.cookie
		.split('; ')
		.find(c => c.startsWith(name + '='))
		?.split('=')[1]

export async function request(path, { method = 'GET', body } = {}) {
	const headers = { Accept: 'application/json' }
	if (body !== undefined) headers['Content-Type'] = 'application/json'
	if (method !== 'GET') {
		const csrf = cookie('csrf_token')
		if (csrf) headers['X-CSRF-Token'] = decodeURIComponent(csrf)
	}

	let res
	try {
		res = await fetch(BASE + path, {
			method,
			headers,
			credentials: 'include',
			body: body === undefined ? undefined : JSON.stringify(body),
		})
	} catch {
		throw new ApiError({
			status: 0,
			code: 'NETWORK',
			message: 'Нет связи с сервером. Попробуйте позже.',
		})
	}

	const data = res.status === 204 ? null : await res.json().catch(() => null)
	if (!res.ok) throw ApiError.from(res.status, data)
	return data
}
