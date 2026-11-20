'use client'

import { useEffect, useRef, useState } from 'react'

import type { CartLine } from '@/lib/cart/cart-store'
import type useCart from '@/lib/cart/use-cart'

export const UNDO_MS = 5000

type Removed = { line: CartLine; index: number; name: string }

/** O'chirish va UNDO_MS ichida "Qaytarish" imkoniyati */
const useUndoRemove = (cart: ReturnType<typeof useCart>) => {
	const [removed, setRemoved] = useState<Removed | null>(null)
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timer.current), [])

	const remove = (id: string) => {
		const index = cart.items.findIndex(item => item.id === id)
		const item = cart.items[index]
		if (!item) return

		cart.remove(id)
		setRemoved({ line: { id, quantity: item.quantity }, index, name: item.product.name })
		clearTimeout(timer.current)
		timer.current = setTimeout(() => setRemoved(null), UNDO_MS)
	}

	const undo = () => {
		if (!removed) return
		cart.restore(removed.line, removed.index)
		clearTimeout(timer.current)
		setRemoved(null)
	}

	return { removed, remove, undo }
}

export default useUndoRemove
