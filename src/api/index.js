// Единая точка входа. Переключение заглушка/бэкенд — переменной VITE_USE_MOCK в .env.local.
import * as mock from './mock.js'
import * as real from './real.js'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const impl = USE_MOCK ? mock : real

if (USE_MOCK && import.meta.env.DEV)
	console.info(
		'[api] работает заглушка: данные хранятся в localStorage браузера',
	)

export const { register, login, logout, me } = impl
export { ApiError, formErrors } from './errors.js'
