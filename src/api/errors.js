// Единый вид ошибок API: страницы работают только с ApiError и не знают про формат бэкенда.
const STATUS_MSG = {
	401: 'Нужно войти в аккаунт',
	403: 'Нет доступа',
	404: 'Не найдено',
	409: 'Такие данные уже есть',
	423: 'Аккаунт временно заблокирован',
	429: 'Слишком много попыток. Подождите немного.',
	500: 'Ошибка сервера. Попробуйте позже.',
}

export class ApiError extends Error {
	constructor({ status, code, message, fields = {} }) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.code = code
		this.fields = fields
	}

	static from(status, data) {
		const d = data?.detail
		if (Array.isArray(d)) {
			const fields = {}
			d.forEach(x => {
				const f = x.loc?.[x.loc.length - 1]
				if (typeof f === 'string' && !fields[f])
					fields[f] = 'Проверьте это поле'
			})
			return new ApiError({
				status,
				code: 'VALIDATION',
				message: 'Проверьте введённые данные',
				fields,
			})
		}
		if (d && typeof d === 'object') {
			return new ApiError({
				status,
				code: d.code ?? 'ERROR',
				message: d.message ?? STATUS_MSG[status] ?? 'Ошибка',
				fields: d.fields ?? {},
			})
		}
		return new ApiError({
			status,
			code: 'ERROR',
			message:
				typeof d === 'string'
					? d
					: (STATUS_MSG[status] ?? 'Что-то пошло не так'),
		})
	}
}

// Имена полей API → имена полей формы на странице входа
const FORM_KEY = {
	full_name: 'name',
	email: 'email',
	phone: 'phone',
	password: 'pw',
	consent: 'ok',
}

/** Ошибки по полям формы: { name?, login?, pw?, ok? } */
export function formErrors(e) {
	const out = {}
	if (e.code === 'EMAIL_TAKEN') out.email = e.message
	if (e.code === 'PHONE_TAKEN') out.phone = e.message
	Object.entries(e.fields).forEach(([k, v]) => {
		const key = FORM_KEY[k]
		if (key && !out[key]) out[key] = v
	})
	return out
}
