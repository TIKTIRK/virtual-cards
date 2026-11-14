// Реальный бэкенд
import { request } from './client.js'
import { ApiError } from './errors.js'
import { normalizePhone, splitLogin } from '../lib/contact.js'

const toUser = d => ({
	id: d.id,
	fullName: d.full_name,
	email: d.email ?? null,
	phone: d.phone ?? null,
})

// POST /auth/register
export async function register({ fullName, phone, email, password, consent }) {
	const data = await request('/auth/register', {
		method: 'POST',
		body: {
			full_name: fullName.trim(),
			phone: normalizePhone(phone),
			email: email.trim().toLowerCase(),
			password,
			consent,
		},
	})
	return toUser(data.user)
}

// POST /auth/login
export async function login({ login, password }) {
	const data = await request('/auth/login', {
		method: 'POST',
		body: { ...splitLogin(login), password },
	})
	return toUser(data.user)
}

// POST /auth/logout
export async function logout() {
	await request('/auth/logout', { method: 'POST' })
}

// GET /auth/me — текущий пользователь по куке; 401 значит «не вошёл», это не ошибка
export async function me() {
	try {
		return toUser((await request('/auth/me')).user)
	} catch (e) {
		if (e instanceof ApiError && e.status === 401) return null
		throw e
	}
}
