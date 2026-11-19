'use client'

import { type CSSProperties, useState } from 'react'

/**
 * Karuselsiz avtomatik almashinuv: faol indeks, pauza va taymer.
 * `timer` uslubi berilgan indikator to'lib bo'lgach (onAnimationEnd → `next`) keyingisiga o'tiladi.
 */
const useAutoplay = (count: number, durationMs: number) => {
	const [current, setCurrent] = useState(0)
	const [paused, setPaused] = useState(false)

	const timer: CSSProperties = {
		animationDuration: `${durationMs}ms`,
		animationPlayState: paused ? 'paused' : 'running',
	}

	return {
		current,
		paused,
		setPaused,
		timer,
		next: () => setCurrent(index => (index + 1) % count),
		goTo: setCurrent,
	}
}

export default useAutoplay
