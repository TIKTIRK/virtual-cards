// Единый разбор «почта или телефон»: и заглушка, и реальный API получают одинаковый формат.
const digits = s => s.replace(/\D/g, '')

export function normalizePhone(v) {
	let d = digits(v)
	if (d.length === 11 && d.startsWith('8')) d = '7' + d.slice(1)
	if (d.length === 10) d = '7' + d
	return '+' + d
}

export function splitLogin(v) {
	const t = v.trim()
	return t.includes('@')
		? { email: t.toLowerCase() }
		: { phone: normalizePhone(t) }
}
