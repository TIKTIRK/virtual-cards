import Hero from '../../sections/Hero/Hero.jsx'
import Features from '../../sections/Features/Features.jsx'
import HowItWorks from '../../sections/HowItWorks/HowItWorks.jsx'
import Services from '../../sections/Services/Services.jsx'
import Faq from '../../sections/Faq/Faq.jsx'

export default function Home() {
	return (
		<main id='main' tabIndex='-1'>
			<Hero />
			<Features />
			<HowItWorks />
			<Services />
			<Faq />
		</main>
	)
}
