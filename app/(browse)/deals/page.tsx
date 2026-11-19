import type { Metadata } from 'next'

import DealsHero from './_components/hero/deals-hero'
import WeekOffers from './_components/week/week-offers'

export const metadata: Metadata = {
	title: 'Chegirmalar — Ormo',
	description: 'Kameralar, dronlar va stabilizatorlarga bugungi eng katta chegirmalar.',
}

const DealsPage = () => {
	return (
		<>
			<DealsHero />
			<WeekOffers />
		</>
	)
}

export default DealsPage
