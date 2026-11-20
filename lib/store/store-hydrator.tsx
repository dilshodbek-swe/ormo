'use client'

import { useEffect } from 'react'

import { STORE_KEY, useStore } from './index'

/** Eski (zustand'dan oldingi) savat kaliti — bir martalik ko'chirish uchun */
const LEGACY_CART_KEY = 'ormo-cart'

const migrateLegacyCart = () => {
	try {
		const legacy = localStorage.getItem(LEGACY_CART_KEY)
		if (!legacy) return
		localStorage.removeItem(LEGACY_CART_KEY)
		if (useStore.getState().cartLines.length > 0) return

		const lines = JSON.parse(legacy)
		if (Array.isArray(lines)) {
			for (const line of lines) {
				if (typeof line?.id === 'string' && Number.isInteger(line?.quantity)) {
					useStore.getState().addToCart(line.id, line.quantity)
				}
			}
		}
	} catch {
		// Buzilgan eski ma'lumot — e'tiborsiz
	}
}

/**
 * Hydration'dan keyin store'ni localStorage'dan tiklaydi va
 * boshqa tabda o'zgarganda shu tabni ham yangilaydi. Hech narsa render qilmaydi.
 */
const StoreHydrator = () => {
	useEffect(() => {
		useStore.persist.rehydrate()?.then(migrateLegacyCart)

		const onStorage = (event: StorageEvent) => {
			if (event.key === STORE_KEY) useStore.persist.rehydrate()
		}
		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [])

	return null
}

export default StoreHydrator
