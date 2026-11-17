'use client'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { picks } from './picks'
import SpotlightHeader from './spotlight-header'
import SpotlightProgress from './spotlight-progress'
import SpotlightSlide from './spotlight-slide'
import useSpotlight from './use-spotlight'

const Spotlight = () => {
	const { setApi, current, paused, setPaused, timer, prev, next, goTo } = useSpotlight()

	return (
		<section
			className='space-y-5'
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<SpotlightHeader
				current={current}
				paused={paused}
				timer={timer}
				onPrev={prev}
				onNext={next}
			/>

			<Carousel setApi={setApi} opts={{ loop: true, align: 'start' }}>
				<CarouselContent>
					{picks.map((pick, index) => (
						<CarouselItem key={pick.id} className='md:basis-[86%]'>
							<SpotlightSlide pick={pick} index={index} isActive={index === current} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<SpotlightProgress
				current={current}
				paused={paused}
				timer={timer}
				onSelect={goTo}
				onComplete={next}
			/>
		</section>
	)
}

export default Spotlight
