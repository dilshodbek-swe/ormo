'use client'

import { maxDiscount } from '@/lib/data/deals'
import useAutoplay from '@/lib/hooks/use-autoplay'
import DealInfo from './deal-info'
import DealStage from './deal-stage'
import DealThumbs from './deal-thumbs'
import DealsTicker from './deals-ticker'
import FallingWord from './falling-word'
import HeroCountdown from './hero-countdown'
import { AUTOPLAY_MS, heroDeals } from './hero-deals'

const DealsHero = () => {
	const { current, setPaused, timer, next, goTo } = useAutoplay(heroDeals.length, AUTOPLAY_MS)
	const deal = heroDeals[current]

	return (
		<section
			className='overflow-hidden bg-foreground text-background'
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className='mx-auto max-w-7xl space-y-10 px-4 pt-10 pb-8 sm:px-6 md:pt-14'>
				<div className='flex flex-wrap items-center justify-between gap-4'>
					<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
						Chegirmalar · -{maxDiscount}% gacha
					</p>
					<HeroCountdown />
				</div>

				<div className='grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12'>
					<div className='space-y-10'>
						<h1 className='font-space-grotesk text-5xl leading-[0.95] font-bold tracking-tighter sm:text-7xl'>
							Narxlar <FallingWord word='tushdi.' delayMs={200} />
							<span className='mt-2 block text-background/40'>Kadrlar emas.</span>
						</h1>

						{/* key — slayd almashganda narx animatsiyasi qaytadan o'ynaydi */}
						<DealInfo key={deal.id} deal={deal} />
					</div>

					{/* Sahnalar ustma-ust turadi — faoli ko'rinadi, qolganlari so'nib ketadi */}
					<div className='order-first grid lg:order-0'>
						{heroDeals.map((item, index) => (
							<DealStage
								key={item.id}
								deal={item}
								isActive={index === current}
								className='[grid-area:1/1]'
							/>
						))}
					</div>
				</div>

				<DealThumbs current={current} timer={timer} onSelect={goTo} onComplete={next} />
			</div>

			<DealsTicker />
		</section>
	)
}

export default DealsHero
