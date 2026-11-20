'use client'

import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'

export type ZoomPoint = { x: number; y: number }

/** Surish (swipe) shu masofadan uzun bo'lsa, rasm almashadi */
const SWIPE_THRESHOLD = 40

/**
 * Galereya holati: faol rasm, sichqoncha bilan kattalashtirish nuqtasi,
 * klaviatura (← →) va barmoq bilan surish.
 */
const useGallery = (count: number) => {
	const [index, setIndex] = useState(0)
	const [point, setPoint] = useState<ZoomPoint | null>(null)
	const swipeStart = useRef<number | null>(null)

	const goTo = (next: number) => {
		setIndex((next + count) % count)
		setPoint(null)
	}

	const stageHandlers = {
		onPointerMove: (event: PointerEvent<HTMLElement>) => {
			if (event.pointerType !== 'mouse') return
			const rect = event.currentTarget.getBoundingClientRect()
			setPoint({
				x: (event.clientX - rect.left) / rect.width,
				y: (event.clientY - rect.top) / rect.height,
			})
		},
		onPointerLeave: () => setPoint(null),
		onPointerDown: (event: PointerEvent<HTMLElement>) => {
			if (event.pointerType !== 'mouse') swipeStart.current = event.clientX
		},
		onPointerUp: (event: PointerEvent<HTMLElement>) => {
			if (swipeStart.current === null) return
			const delta = event.clientX - swipeStart.current
			swipeStart.current = null
			if (Math.abs(delta) > SWIPE_THRESHOLD) goTo(index + (delta < 0 ? 1 : -1))
		},
		onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
			if (event.key === 'ArrowRight') goTo(index + 1)
			if (event.key === 'ArrowLeft') goTo(index - 1)
		},
	}

	return {
		index,
		point,
		goTo,
		next: () => goTo(index + 1),
		prev: () => goTo(index - 1),
		stageHandlers,
	}
}

export default useGallery
