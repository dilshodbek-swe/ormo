'use client'

import { type CSSProperties, useCallback, useEffect, useState } from 'react'

import type { CarouselApi } from '@/components/ui/carousel'

/**
 * Avtomatik aylanadigan karusel holati: faol slayd, pauza va taymer.
 *
 * Aylanish CSS animatsiyasi orqali boshqariladi: `timer` uslubi berilgan indikator
 * to'lib bo'lgach (onAnimationEnd → `next`) keyingi slaydga o'tiladi.
 * Pauza paytida animatsiya to'xtaydi — indikator ham, vaqt ham.
 */
const useAutoplayCarousel = (durationMs: number) => {
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [paused, setPaused] = useState(false)

	const onSelect = useCallback((carousel: CarouselApi) => {
		if (carousel) setCurrent(carousel.selectedScrollSnap())
	}, [])

	useEffect(() => {
		if (!api) return
		// Boshlang'ich slayd 0 — faqat keyingi o'zgarishlarga obuna bo'lamiz
		api.on('select', onSelect)
		return () => {
			api.off('select', onSelect)
		}
	}, [api, onSelect])

	const timer: CSSProperties = {
		animationDuration: `${durationMs}ms`,
		animationPlayState: paused ? 'paused' : 'running',
	}

	return {
		setApi,
		current,
		paused,
		setPaused,
		timer,
		prev: () => api?.scrollPrev(),
		next: () => api?.scrollNext(),
		goTo: (index: number) => api?.scrollTo(index),
	}
}

export default useAutoplayCarousel
