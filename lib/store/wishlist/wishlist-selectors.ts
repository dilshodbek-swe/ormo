import { useMemo } from 'react'

import { catalogProducts } from '@/lib/data/catalog'
import type { Product } from '@/lib/data/products'
import { type StoreState, useStore } from '../index'
import type { WishlistEntry } from './wishlist-slice'

export interface WishlistItem extends WishlistEntry {
	product: Product
}

const productById = new Map(catalogProducts.map(product => [product.id, product]))

export const selectWishlistCount = (state: StoreState) => state.wishlist.length

export const selectIsWished = (id: string) => (state: StoreState) =>
	state.wishlist.some(entry => entry.id === id)

/** Sevimlilar mahsulot ma'lumotlari bilan — ro'yxat o'zgarmasa, o'sha massiv qaytadi */
export const useWishlistItems = () => {
	const list = useStore(state => state.wishlist)
	return useMemo(
		() =>
			list.flatMap<WishlistItem>(entry => {
				const product = productById.get(entry.id)
				return product ? [{ ...entry, product }] : []
			}),
		[list]
	)
}
