const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+0-9\s()-]+$/
const digits = s => s.replace(/\D/g, '')
const isPhone = v =>
	PHONE.test(v) && digits(v).length >= 10 && digits(v).length <= 15

export function validate({ name, phone, email, login, pw, ok }, register) {
	const e = {}
	if (register) {
		if (name.trim().split(/\s+/).filter(Boolean).length < 2)
			e.name = 'Укажите фамилию, имя и отчество (если есть)'
		if (!isPhone(phone.trim())) e.phone = 'Введите корректный номер телефона'
		if (!EMAIL.test(email.trim())) e.email = 'Введите корректный email'
	} else {
		const v = login.trim()
		if (!EMAIL.test(v) && !isPhone(v))
			e.login = v
				? 'Проверьте формат почты или телефона'
				: 'Введите почту или телефон'
	}
	if (!pw || (register && pw.length < 8))
		e.pw = register ? 'Пароль — минимум 8 символов' : 'Введите пароль'
	if (register && !ok) e.ok = 'Нужно согласие на обработку данных'
	return e
}
