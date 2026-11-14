import useInView from '../../hooks/useInView.js'

export default function Reveal({ children }) {
	const [ref, seen] = useInView()
	return (
		<div ref={ref} className={'rv' + (seen ? ' in' : '')}>
			{children}
		</div>
	)
}
