import { useState } from 'react'
import Reveal from '../../components/Reveal/Reveal.jsx'
import { FAQ } from '../../data/faq.js'

export default function Faq() {
	const [open, setOpen] = useState(-1)
	return (
		<section className='sec' id='faq'>
			<div className='wrap fq'>
				<Reveal>
					<h2 style={{ marginBottom: 12 }}>Частые вопросы</h2>
					{FAQ.map(([q, a], i) => {
						const on = open === i
						return (
							<div className='fi' key={q}>
								<h3>
									<button
										type='button'
										id={'fb' + i}
										aria-expanded={on}
										aria-controls={'f' + i}
										onClick={() => setOpen(on ? -1 : i)}
									>
										{q}
									</button>
								</h3>
								<div
									className={'fp' + (on ? ' o' : '')}
									id={'f' + i}
									role='region'
									aria-labelledby={'fb' + i}
									inert={on ? undefined : ''}
								>
									<div>
										<p>{a}</p>
									</div>
								</div>
							</div>
						)
					})}
				</Reveal>
			</div>
		</section>
	)
}
