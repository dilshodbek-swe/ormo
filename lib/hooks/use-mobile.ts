import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

const subscribe = (onChange: () => void) => {
	const mql = window.matchMedia(MOBILE_QUERY)
	mql.addEventListener('change', onChange)
	return () => mql.removeEventListener('change', onChange)
}

/** `md` breakpoint'dan kichik ekranmi. Serverda — `false`. */
export const useIsMobile = () =>
	useSyncExternalStore(
		subscribe,
		() => window.matchMedia(MOBILE_QUERY).matches,
		() => false
	)
