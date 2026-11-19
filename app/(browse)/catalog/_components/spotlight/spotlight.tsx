'use client'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import useAutoplayCarousel from '@/lib/hooks/use-autoplay-carousel'
import { AUTOPLAY_MS, picks } from './picks'
import SpotlightHeader from './spotlight-header'
import SpotlightProgress from './spotlight-progress'
import SpotlightSlide from './spotlight-slide'

const Spotlight = () => {
	const { setApi, current, paused, setPaused, timer, prev, next, goTo } =
		useAutoplayCarousel(AUTOPLAY_MS)

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
