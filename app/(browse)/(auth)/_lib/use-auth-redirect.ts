'use client'

import type { SetActiveNavigate } from '@clerk/nextjs/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Faqat o'z saytimizdagi manzilga ruxsat beramiz (open redirect'ning oldini olish).
 * Clerk middleware to'liq URL beradi (`http://localhost:3000/orders`) — undan yo'lni ajratamiz.
 */
const safePath = (value: string | null) => {
	if (!value) return '/'
	const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin
	try {
		const url = new URL(value, origin)
		return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : '/'
	} catch {
		return '/'
	}
}

/**
 * Kirish/ro'yxatdan o'tishdan keyin qayerga qaytishni boshqaradi.
 * `?redirect_url=` ni (Clerk middleware shu nomdan foydalanadi) o'qiydi va
 * `finalize({ navigate })` uchun tayyor funksiya qaytaradi.
 */
export const useAuthRedirect = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const redirectTo = safePath(searchParams.get('redirect_url'))

	const navigate = useCallback<SetActiveNavigate>(
		({ session, decorateUrl }) => {
			// Sessiyada bajarilmagan vazifa bo'lsa (masalan, MFA sozlash) — hozircha kutamiz
			if (session?.currentTask) return

			const url = decorateUrl(redirectTo)
			if (url.startsWith('http')) window.location.href = url
			else router.push(url)
		},
		[redirectTo, router]
	)

	/** Boshqa auth sahifasiga o'tganda qaytish manzilini saqlab qolish uchun */
	const withRedirect = (path: string) =>
		redirectTo === '/' ? path : `${path}?redirect_url=${encodeURIComponent(redirectTo)}`

	return { redirectTo, navigate, withRedirect }
}
