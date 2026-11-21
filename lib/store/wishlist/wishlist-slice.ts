import type { StateCreator } from 'zustand'

import type { StoreState } from '../index'

export interface WishlistEntry {
	id: string
	/** Qachon qo'shilgani (ISO) — "yangi qo'shilganlar" bo'yicha saralash uchun */
	addedAt: string
}

export interface WishlistSlice {
	wishlist: WishlistEntry[]
	/** Bor bo'lsa olib tashlaydi, yo'q bo'lsa qo'shadi */
	toggleWishlist: (id: string) => void
	removeFromWishlist: (id: string) => void
	clearWishlist: () => void
}

export const createWishlistSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never], ['zustand/persist', unknown]],
	[],
	WishlistSlice
> = (set, get) => ({
	wishlist: [],

	toggleWishlist: id => {
		const list = get().wishlist
		set(
			{
				wishlist: list.some(entry => entry.id === id)
					? list.filter(entry => entry.id !== id)
					: [{ id, addedAt: new Date().toISOString() }, ...list],
			},
			false,
			'wishlist/toggle'
		)
	},

	removeFromWishlist: id =>
		set({ wishlist: get().wishlist.filter(entry => entry.id !== id) }, false, 'wishlist/remove'),

	clearWishlist: () => set({ wishlist: [] }, false, 'wishlist/clear'),
})
