import { Link } from 'react-router-dom'
import Globe from '../../components/Globe/Globe.jsx'
import VirtualCard from '../../components/VirtualCard/VirtualCard.jsx'
import { useAuth } from '../../auth.jsx'

export default function Hero() {
	const { user } = useAuth()
	return (
		<section className='hero'>
			<Globe />
			<div className='wrap hin'>
				<div>
					<h1>Платите за границей как дома</h1>
					<p className='lead'>
						Виртуальная карта за 2 минуты. Пополняйте в рублях, платите в
						долларах.
					</p>
					<div className='cta'>
						<Link className='btn' to={user ? '/cabinet' : '/register'}>
							Выпустить карту
						</Link>
						<Link className='btn g' to='/#services'>
							Проверить сервис
						</Link>
					</div>
				</div>
				<div className='vis'>
					<VirtualCard />
				</div>
			</div>
		</section>
	)
}
