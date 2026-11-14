// ЗАГЛУШКА БЭКЕНДА
import { ApiError } from './errors.js'
import { normalizePhone, splitLogin } from '../lib/contact.js'

const DB = 'gz_mock_db'
const SESSION = 'gz_mock_session'

const load = () => JSON.parse(localStorage.getItem(DB)) || { users: [] }
const save = db => localStorage.setItem(DB, JSON.stringify(db))
const wait = v => new Promise(r => setTimeout(() => r(v), 200))
const err = (status, code, message, fields) =>
	new ApiError({ status, code, message, fields })

async function sha256(text) {
	const buf = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(text),
	)
	return [...new Uint8Array(buf)]
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
}

const publicUser = u => ({
	id: u.id,
	fullName: u.fullName,
	email: u.email,
	phone: u.phone,
})

export async function register({ fullName, phone, email, password, consent }) {
	if (!consent)
		throw err(422, 'VALIDATION', 'Проверьте введённые данные', {
			consent: 'Нужно согласие на обработку данных',
		})
	const normalizedEmail = email.trim().toLowerCase()
	const normalizedPhone = normalizePhone(phone)
	const db = load()
	if (db.users.some(u => u.email === normalizedEmail))
		throw err(409, 'EMAIL_TAKEN', 'Этот email уже зарегистрирован')
	if (db.users.some(u => u.phone === normalizedPhone))
		throw err(409, 'PHONE_TAKEN', 'Этот телефон уже зарегистрирован')
	const user = {
		id: crypto.randomUUID(),
		fullName: fullName.trim(),
		email: normalizedEmail,
		phone: normalizedPhone,
		passwordHash: await sha256(password), // на бэкенде — Argon2id
		consentAt: new Date().toISOString(),
	}
	db.users.push(user)
	save(db)
	localStorage.setItem(SESSION, user.id)
	return wait(publicUser(user))
}

export async function login({ login, password }) {
	const c = splitLogin(login)
	const hash = await sha256(password)
	const user = load().users.find(
		u =>
			(c.email ? u.email === c.email : u.phone === c.phone) &&
			u.passwordHash === hash,
	)
	if (!user)
		throw err(401, 'INVALID_CREDENTIALS', 'Неверная почта, телефон или пароль')
	localStorage.setItem(SESSION, user.id)
	return wait(publicUser(user))
}

export async function logout() {
	localStorage.removeItem(SESSION)
}

export async function me() {
	const u = load().users.find(x => x.id === localStorage.getItem(SESSION))
	return u ? publicUser(u) : null
}
