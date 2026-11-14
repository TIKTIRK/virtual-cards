import Reveal from '../../components/Reveal/Reveal.jsx'

const STEPS = [
	'Зарегистрируйтесь по почте или телефону',
	'Выпустите виртуальную карту и пополните баланс',
	'Оплачивайте сервисы и поездки по реквизитам',
]

export default function HowItWorks() {
	return (
		<section className='sec' id='how'>
			<div className='wrap'>
				<Reveal>
					<h2>Откройте карту за три шага</h2>
					<ol className='steps'>
						{STEPS.map(s => (
							<li key={s}>
								<h3>{s}</h3>
							</li>
						))}
					</ol>
				</Reveal>
			</div>
		</section>
	)
}
