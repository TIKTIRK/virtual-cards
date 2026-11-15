import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../auth.jsx'
import { ApiError, formErrors } from '../../api/index.js'
import { validate } from './validate.js'

const MODE = {
	login: {
		h: 'Вход в кабинет',
		s: 'Введите почту или телефон и пароль.',
		b: 'Войти',
	},
	register: { h: 'Регистрация', s: '', b: 'Создать аккаунт' },
}
const ORDER = ['name', 'phone', 'email', 'login', 'pw', 'ok'] // порядок полей на странице — для фокуса на первой ошибке

function Field({ id, label, error, children }) {
	return (
		<div className='f'>
			<label htmlFor={id}>{label}</label>
			{children}
			<span id={'e-' + id} className='er' role='alert'>
				{error || ''}
			</span>
		</div>
	)
}

export default function Auth({ mode }) {
	const T = MODE[mode],
		reg = mode === 'register'
	const { user, login, register } = useAuth()
	const [f, setF] = useState({
		name: '',
		phone: '',
		email: '',
		login: '',
		pw: '',
		ok: false,
	})
	const [err, setErr] = useState({})
	const [shake, setShake] = useState(false)
	const [busy, setBusy] = useState(false)
	const [msg, setMsg] = useState('')
	const [show, setShow] = useState(false)
	const head = useRef(null)

	useEffect(() => {
		head.current?.focus({ preventScroll: true })
		document.title = T.h + ' — Виртуальные карты'
		setErr({})
		setMsg('')
	}, [mode])

	// после входа уходим в кабинет
	if (user) return <Navigate to='/cabinet' replace />

	const set = k => e =>
		setF({ ...f, [k]: k === 'ok' ? e.target.checked : e.target.value })

	const showErrors = er => {
		setErr(er)
		const first = ORDER.find(k => er[k])
		if (first) {
			setShake(true)
			document.getElementById(first)?.focus()
		}
		return Boolean(first)
	}

	const submit = async e => {
		e.preventDefault()
		if (showErrors(validate(f, reg))) return // сначала проверка на клиенте
		setBusy(true)
		setMsg('')
		try {
			if (reg)
				await register({
					fullName: f.name,
					phone: f.phone,
					email: f.email,
					password: f.pw,
					consent: f.ok,
				})
			else await login({ login: f.login, password: f.pw })
		} catch (ex) {
			// ошибки по полям с бэкенда (занятый email, невалидный пароль…) показываем у полей, остальное — общим сообщением
			const fe = ex instanceof ApiError ? formErrors(ex) : {}
			if (!showErrors(fe)) setMsg(ex.message || 'Не удалось выполнить запрос')
			setBusy(false)
		}
	}

	return (
		<main id='main' className='au'>
			<section className='apanel' aria-labelledby='ah'>
				<div className='auth-tabs' role='tablist' aria-label='Авторизация'>
					<Link
						to='/login'
						role='tab'
						aria-selected={!reg}
						className={!reg ? 'active' : ''}
					>
						Вход
					</Link>
					<Link
						to='/register'
						role='tab'
						aria-selected={reg}
						className={reg ? 'active' : ''}
					>
						Регистрация
					</Link>
				</div>
				{!reg && (
					<>
						<h1 id='ah' ref={head} tabIndex='-1'>
							{T.h}
						</h1>
						<p className='sub'>{T.s}</p>
					</>
				)}
				{reg && (
					<h1 id='ah' ref={head} tabIndex='-1' className='visually-hidden'>
						Регистрация
					</h1>
				)}
				<form
					noValidate
					onSubmit={submit}
					className={shake ? 'shake' : ''}
					onAnimationEnd={e => e.animationName === 'shake' && setShake(false)}
				>
					{reg ? (
						<>
							<Field id='name' label='ФИО' error={err.name}>
								<input
									id='name'
									type='text'
									autoComplete='name'
									value={f.name}
									onChange={set('name')}
									aria-invalid={!!err.name}
									aria-describedby='e-name'
								/>
							</Field>
							<Field id='phone' label='Телефон' error={err.phone}>
								<input
									id='phone'
									type='tel'
									inputMode='tel'
									autoComplete='tel'
									placeholder='+7 900 000-00-00'
									value={f.phone}
									onChange={set('phone')}
									aria-invalid={!!err.phone}
									aria-describedby='e-phone'
								/>
							</Field>
							<Field id='email' label='Email' error={err.email}>
								<input
									id='email'
									type='email'
									inputMode='email'
									autoComplete='email'
									value={f.email}
									onChange={set('email')}
									aria-invalid={!!err.email}
									aria-describedby='e-email'
								/>
							</Field>
						</>
					) : (
						<Field id='login' label='Почта или телефон' error={err.login}>
							<input
								id='login'
								type='text'
								autoComplete='username'
								value={f.login}
								onChange={set('login')}
								aria-invalid={!!err.login}
								aria-describedby='e-login'
							/>
						</Field>
					)}
					<Field id='pw' label='Пароль' error={err.pw}>
						<div className='pw'>
							<input
								id='pw'
								name={reg ? 'new-password' : 'password'}
								type={show ? 'text' : 'password'}
								autoComplete={reg ? 'new-password' : 'current-password'}
								value={f.pw}
								onChange={set('pw')}
								aria-invalid={!!err.pw}
								aria-describedby='e-pw'
							/>
							<button
								type='button'
								aria-pressed={show}
								onClick={() => setShow(!show)}
							>
								{show ? 'Скрыть' : 'Показать'}
							</button>
						</div>
					</Field>
					{reg && (
						<div>
							<div className='chk'>
								<input
									id='ok'
									type='checkbox'
									checked={f.ok}
									onChange={set('ok')}
									aria-describedby='e-ok'
								/>
								<label htmlFor='ok'>
									Согласен на обработку персональных данных
								</label>
							</div>
							<span id='e-ok' className='er' role='alert'>
								{err.ok || ''}
							</span>
						</div>
					)}
					{msg && (
						<p className='msg bad' role='alert'>
							{msg}
						</p>
					)}
					<button
						className='btn'
						type='submit'
						disabled={busy}
						style={{ width: '100%', marginTop: 10 }}
					>
						{busy ? 'Подождите…' : T.b}
					</button>
				</form>
			</section>
		</main>
	)
}
