'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/** Ketma-ket ikkinchi tugma uchun kutish vaqti */
const SEQUENCE_TIMEOUT = 900

const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export interface ShortcutLink {
	href: string
	/** `G` dan keyin bosiladigan harf */
	shortcut: string
}

/**
 * Vercel/GitHub uslubidagi yorliqlar: `G` → `O` buyurtmalarga, `G` → `S` sozlamalarga va h.k.
 * Matn kiritilayotganda ishlamaydi. `links` modul darajasidagi barqaror massiv bo'lishi kerak.
 */
export const useNavShortcuts = (links: readonly ShortcutLink[]) => {
	const router = useRouter()

	useEffect(() => {
		let armedAt = 0

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
			const key = event.key.toUpperCase()

			if (armedAt && Date.now() - armedAt < SEQUENCE_TIMEOUT) {
				armedAt = 0
				const link = links.find(item => item.shortcut === key)
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
	}, [router, links])
}
