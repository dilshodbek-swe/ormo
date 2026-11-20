import type { StateCreator } from 'zustand'

import { getStock } from '@/lib/data/product-details'
import type { StoreState } from '../index'
import { type AppliedPromo, findPromo } from './cart-pricing'

export interface CartLine {
	id: string
	quantity: number
}

export interface CartSlice {
	cartLines: CartLine[]
	promo: AppliedPromo | null
	/** Oxirgi o'chirilgan qator — "Qaytarish" uchun (saqlanmaydi) */
	lastRemoved: { line: CartLine; index: number } | null

	/** Qo'shadi; ombordagi qoldiqdan oshirmaydi */
	addToCart: (id: string, quantity?: number) => void
	/** 0 yoki undan kam — qatorni o'chiradi; qoldiqdan oshirmaydi */
	setCartQuantity: (id: string, quantity: number) => void
	removeFromCart: (id: string) => void
	undoRemove: () => void
	dismissUndo: () => void
	clearCart: () => void
	/** Kod topilsa qo'llaydi va `true` qaytaradi */
	applyPromo: (code: string) => boolean
	removePromo: () => void
}

export const createCartSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never], ['zustand/persist', unknown]],
	[],
	CartSlice
> = (set, get) => ({
	cartLines: [],
	promo: null,
	lastRemoved: null,

	addToCart: (id, quantity = 1) => {
		const lines = get().cartLines
		const existing = lines.find(line => line.id === id)
		const next = Math.min((existing?.quantity ?? 0) + quantity, getStock(id))
		if (next <= 0 || next === existing?.quantity) return

		set(
			{
				cartLines: existing
					? lines.map(line => (line.id === id ? { ...line, quantity: next } : line))
					: [...lines, { id, quantity: next }],
			},
			false,
			'cart/add'
		)
	},

	setCartQuantity: (id, quantity) => {
		if (quantity <= 0) return get().removeFromCart(id)
		const clamped = Math.min(quantity, getStock(id))

		set(
			{
				cartLines: get().cartLines.map(line =>
					line.id === id ? { ...line, quantity: clamped } : line
				),
			},
			false,
			'cart/setQuantity'
		)
	},

	removeFromCart: id => {
		const lines = get().cartLines
		const index = lines.findIndex(line => line.id === id)
		if (index === -1) return

		set(
			{
				cartLines: lines.filter(line => line.id !== id),
				lastRemoved: { line: lines[index], index },
			},
			false,
			'cart/remove'
		)
	},

	undoRemove: () => {
		const { lastRemoved, cartLines } = get()
		if (!lastRemoved) return
		// Shu orada qayta qo'shilgan bo'lsa — takrorlamaymiz
		if (cartLines.some(line => line.id === lastRemoved.line.id)) {
			return set({ lastRemoved: null }, false, 'cart/undo')
		}

		const next = [...cartLines]
		next.splice(Math.min(lastRemoved.index, next.length), 0, lastRemoved.line)
		set({ cartLines: next, lastRemoved: null }, false, 'cart/undo')
	},

	dismissUndo: () => set({ lastRemoved: null }, false, 'cart/dismissUndo'),

	clearCart: () => set({ cartLines: [], lastRemoved: null }, false, 'cart/clear'),

	applyPromo: code => {
		const promo = findPromo(code)
		if (promo) set({ promo }, false, 'cart/applyPromo')
		return promo !== null
	},

	removePromo: () => set({ promo: null }, false, 'cart/removePromo'),
})
