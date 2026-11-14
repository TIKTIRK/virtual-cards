import { useMemo } from 'react'

const C = 470,
	R = 430

export default function Globe() {
	const lines = useMemo(() => {
		const out = [<circle key='c' cx={C} cy={C} r={R} />]
		for (let i = 1; i < 8; i++) {
			const rx = Math.abs(R * Math.cos((i * Math.PI) / 8))
			out.push(
				rx < 1 ? (
					<line key={'m' + i} x1={C} y1={C - R} x2={C} y2={C + R} />
				) : (
					<ellipse key={'m' + i} cx={C} cy={C} rx={rx} ry={R} />
				),
			)
		}
		for (let k = -3; k <= 3; k++) {
			const p = (k * Math.PI) / 8,
				rx = R * Math.cos(p)
			out.push(
				<ellipse
					key={'p' + k}
					cx={C}
					cy={C + R * Math.sin(p) * 0.92}
					rx={rx}
					ry={rx * 0.2}
				/>,
			)
		}
		return out
	}, [])
	return (
		<div className='globe' aria-hidden='true'>
			<svg
				viewBox='0 0 940 940'
				fill='none'
				stroke='currentColor'
				strokeWidth='1'
			>
				{lines}
				<path className='route' d='M330 520 Q520 200 760 380' />
				<circle className='dot' cx='330' cy='520' r='5' />
				<circle
					className='dot'
					cx='760'
					cy='380'
					r='5'
					style={{ animationDelay: '1.2s' }}
				/>
			</svg>
		</div>
	)
}
