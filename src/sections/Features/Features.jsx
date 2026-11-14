import Reveal from '../../components/Reveal/Reveal.jsx'
import { FEATURES } from '../../data/features.js'
import { ART } from '../../data/illustrations.js'

export default function Features() {
	return (
		<section className='sec'>
			<div className='wrap'>
				<Reveal>
					<h2>Всё для удобных платежей</h2>
					<div className='bento'>
						{FEATURES.map(f => (
							<article className='bc' key={f.title}>
								<div className='bt'>
									<h3>{f.title}</h3>
									<p>{f.text}</p>
								</div>
								{/* иллюстрации — статичный SVG из репозитория, пользовательского ввода тут нет */}
								<div
									className='art'
									aria-hidden='true'
									dangerouslySetInnerHTML={{ __html: ART[f.art] }}
								/>
							</article>
						))}
					</div>
				</Reveal>
			</div>
		</section>
	)
}
