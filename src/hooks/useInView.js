import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './useReducedMotion.js'

export default function useInView(margin = '0px 0px -8% 0px') {
	const ref = useRef(null)
	const [seen, setSeen] = useState(prefersReducedMotion)
	useEffect(() => {
		if (seen) return
		const o = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setSeen(true)
					o.disconnect()
				}
			},
			{ rootMargin: margin },
		)
		o.observe(ref.current)
		return () => o.disconnect()
	}, [seen, margin])
	return [ref, seen]
}
