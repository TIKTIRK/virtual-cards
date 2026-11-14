import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo/Logo.jsx'
import { useAuth } from '../../auth.jsx'

export default function Navbar() {
	const [open, setOpen] = useState(false)
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const { pathname } = useLocation()

	useEffect(() => setOpen(false), [pathname])
	useEffect(() => {
		const k = e => {
			if (e.key === 'Escape') setOpen(false)
		}
		addEventListener('keydown', k)
		return () => removeEventListener('keydown', k)
	}, [])

	const close = () => setOpen(false)
	const out = async () => {
		close()
		await logout()
		navigate('/')
	}
	const actions = (cls = '') =>
		user ? (
			<>
				<Link className={`btn g ${cls}`} to='/cabinet'>
					Личный кабинет
				</Link>
				<button className={`btn ${cls}`} type='button' onClick={out}>
					Выйти
				</button>
			</>
		) : (
			<>
				<Link className={`btn g ${cls}`} to='/login'>
					Войти
				</Link>
				<Link className={`btn ${cls}`} to='/register'>
					Оформить карту
				</Link>
			</>
		)

	return (
		<header className={'nav' + (open ? ' open' : '')}>
			<div className='nav-in'>
				<Link
					className='brand'
					to='/'
					onClick={close}
					aria-label='Виртуальные карты — на главную'
				>
					<Logo />
					Виртуальные карты
				</Link>
				<nav
					className='links'
					id='links'
					aria-label='Основная навигация'
					onClick={close}
				>
					<Link to='/#how'>Как это работает</Link>
					<Link to='/#services'>Сервисы</Link>
					<Link to='/#faq'>Частые вопросы</Link>
					<div className='mob'>{actions()}</div>
				</nav>
				<div className='right'>{actions('sm')}</div>
				<button
					className='mb'
					type='button'
					aria-expanded={open}
					aria-controls='links'
					aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
					onClick={() => setOpen(!open)}
				>
					<svg
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						aria-hidden='true'
					>
						<path
							d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
						/>
					</svg>
				</button>
			</div>
		</header>
	)
}
