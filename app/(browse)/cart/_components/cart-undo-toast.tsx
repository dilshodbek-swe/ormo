'use client'

import { useEffect } from 'react'

import { catalogProducts } from '@/lib/data/catalog'
import { useStore } from '@/lib/store'
import UndoToast from './undo-toast'

const UNDO_MS = 5000

/** Oxirgi o'chirilgan mahsulot uchun "Qaytarish" — UNDO_MS dan keyin o'zi yopiladi */
const CartUndoToast = () => {
	const lastRemoved = useStore(state => state.lastRemoved)
	const undoRemove = useStore(state => state.undoRemove)
	const dismissUndo = useStore(state => state.dismissUndo)

	useEffect(() => {
		if (!lastRemoved) return
		const timer = setTimeout(dismissUndo, UNDO_MS)
		return () => clearTimeout(timer)
	}, [lastRemoved, dismissUndo])

	// Sahifadan chiqib ketilganda eski "Qaytarish" qolib ketmasin
	useEffect(() => dismissUndo, [dismissUndo])

	if (!lastRemoved) return null
	const name = catalogProducts.find(product => product.id === lastRemoved.line.id)?.name ?? ''

	return (
		<UndoToast
			key={`${lastRemoved.line.id}-${lastRemoved.index}`}
			name={name}
			onUndo={undoRemove}
			durationMs={UNDO_MS}
		/>
	)
}

export default CartUndoToast
