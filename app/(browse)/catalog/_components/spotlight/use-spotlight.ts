'use client'

import { type CSSProperties, useCallback, useEffect, useState } from 'react'

import type { CarouselApi } from '@/components/ui/carousel'
import { AUTOPLAY_MS } from './picks'

/** Karusel holati: faol slayd, pauza va avtomatik aylanish taymeri */
const useSpotlight = () => {
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

	/*
	 * Avtomatik aylanish CSS animatsiyasi orqali boshqariladi:
	 * faol indikator to'lib bo'lgach (onAnimationEnd) keyingi slaydga o'tamiz.
	 * Sichqoncha ustida bo'lsa animatsiya pauza qilinadi — loader ham, vaqt ham to'xtaydi.
	 */
	const timer: CSSProperties = {
		animationDuration: `${AUTOPLAY_MS}ms`,
		animationPlayState: paused ? 'paused' : 'running',
	}

	return {
		api,
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

export default useSpotlight
