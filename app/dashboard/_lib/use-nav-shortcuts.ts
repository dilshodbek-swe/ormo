'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { dashboardLinks } from './nav'

/** Ketma-ket ikkinchi tugma uchun kutish vaqti */
const SEQUENCE_TIMEOUT = 900

const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/**
 * Vercel/GitHub uslubidagi yorliqlar: `G` → `O` buyurtmalarga, `G` → `S` sozlamalarga va h.k.
 * Matn kiritilayotganda ishlamaydi.
 */
export const useNavShortcuts = () => {
	const router = useRouter()

	useEffect(() => {
		let armedAt = 0

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
			const key = event.key.toUpperCase()

			if (armedAt && Date.now() - armedAt < SEQUENCE_TIMEOUT) {
				armedAt = 0
				const link = dashboardLinks.find(item => item.shortcut === key)
				if (link) {
					event.preventDefault()
					router.push(link.href)
				}
				return
			}

			armedAt = key === 'G' ? Date.now() : 0
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [router])
}
