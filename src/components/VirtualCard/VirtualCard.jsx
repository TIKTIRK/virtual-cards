import Logo from '../Logo/Logo.jsx'

export default function VirtualCard() {
	return (
		<div
			className='pcard'
			role='img'
			aria-label='карта'
		>
			<div className='pt'>
				<span className='pbrand'>
					<Logo />
					Виртуальные карты
				</span>
				<small>VIRTUAL</small>
			</div>
			<div className='chip'></div>
			<div className='pn'>7777 77•• •••• 7777</div>
			<div className='pb'>
				<div>
					<small>Владелец</small>IVAN IVANOV
				</div>
				<div>
					<small>Срок</small>••/••
				</div>
				<b>USD</b>
			</div>
		</div>
	)
}
