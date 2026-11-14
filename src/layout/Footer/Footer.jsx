import { Link } from 'react-router-dom'
import Logo from '../../components/Logo/Logo.jsx'

export default function Footer() {
	return (
		<footer className='foot'>
			<div className='wrap fg'>
				<div>
					<Link className='brand' to='/'>
						<Logo />
						Виртуальные карты
					</Link>
					<p>© 2026 Виртуальные карты.</p>
				</div>
				<nav aria-label='Документы'>
					<a href='#'>Политика конфиденциальности</a>
					<a href='#'>Условия использования</a>
					<a href='#'>Обработка данных</a>
				</nav>
			</div>
		</footer>
	)
}
