import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { type CartSlice, createCartSlice } from './cart/cart-slice'

/**
 * Ilovaning yagona store'i. Yangi bo'lim qo'shish uchun:
 *   1) `lib/store/<nom>/<nom>-slice.ts` da slice yozing,
 *   2) uni shu yerda `StoreState` ga va `create` ichiga qo'shing,
 *   3) saqlanishi kerak bo'lsa — `partialize` ga kiriting.
 */
export type StoreState = CartSlice

export const STORE_KEY = 'ormo-store'

export const useStore = create<StoreState>()(
	devtools(
		persist(
			(...args) => ({
				...createCartSlice(...args),
			}),
			{
				name: STORE_KEY,
				version: 1,
				storage: createJSONStorage(() => localStorage),
				// Faqat ma'lumot saqlanadi; vaqtinchalik UI holati (lastRemoved) — yo'q
				partialize: state => ({
					cartLines: state.cartLines,
					promo: state.promo,
				}),
				// Server va birinchi client render bir xil (bo'sh) bo'lishi uchun —
				// tiklash StoreHydrator'da, hydration'dan keyin
				skipHydration: true,
			}
		),
		{ name: 'ormo', enabled: process.env.NODE_ENV !== 'production' }
	)
)
