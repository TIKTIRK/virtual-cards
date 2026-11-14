import { useEffect } from 'react'
import { useAuth } from '../../auth.jsx'

export default function Cabinet() {
	const { user } = useAuth()
	useEffect(() => {
		document.title = 'Личный кабинет — Виртуальные карты'
	}, [])

	return (
		<main id='main' className='cab wrap' tabIndex='-1'>
			<h1>Личный кабинет</h1>
			<p className='sub'>
				{user.fullName} · {user.email ?? user.phone}
			</p>
		</main>
	)
}
