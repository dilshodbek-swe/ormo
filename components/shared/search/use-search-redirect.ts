'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/** Yozish to'xtagach shuncha vaqtdan keyin do'konga o'tiladi */
export const REDIRECT_DELAY_MS = 1500
/** Bir harfli so'rov bilan sakrab ketmaslik uchun */
export const MIN_QUERY_LENGTH = 2

export const shopSearchUrl = (query: string) => `/shop?q=${encodeURIComponent(query.trim())}`

type Options = {
	query: string
	/** Natijalar ustida turganda yoki natija yo'q bo'lsa — kutib turadi */
	paused: boolean
	onNavigate: () => void
}

/**
 * Debounce bilan avtomatik o'tish: har yangi harf taymerni qaytadan boshlaydi.
 * `go()` — Enter bosilganda darhol o'tish uchun.
 */
const useSearchRedirect = ({ query, paused, onNavigate }: Options) => {
	const router = useRouter()
	const trimmed = query.trim()
	const armed = trimmed.length >= MIN_QUERY_LENGTH && !paused

	const go = (target = shopSearchUrl(trimmed)) => {
		onNavigate()
		router.push(target)
	}

	useEffect(() => {
		if (!armed) return
		const timer = setTimeout(() => {
			onNavigate()
			router.push(shopSearchUrl(trimmed))
		}, REDIRECT_DELAY_MS)
		return () => clearTimeout(timer)
	}, [armed, trimmed, onNavigate, router])

	return { armed, go }
}

export default useSearchRedirect
