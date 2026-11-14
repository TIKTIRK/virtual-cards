export default function Logo() {
	return (
		<svg
			viewBox='0 0 32 32'
			width='28'
			height='28'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			aria-hidden='true'
		>
			<rect
				x='3'
				y='6'
				width='26'
				height='20'
				rx='4'
				stroke='currentColor'
				strokeWidth='1.8'
			/>
			<path d='M4 12h24' stroke='currentColor' strokeWidth='2' />
			<rect x='7' y='17' width='6' height='4' rx='1' fill='var(--acc)' />
			<path
				d='M19 19h6'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
			/>
		</svg>
	)
}
