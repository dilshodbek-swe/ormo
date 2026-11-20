import { useMemo } from 'react'

import { catalogProducts } from '@/lib/data/catalog'
import { getStock } from '@/lib/data/product-details'
import type { Product } from '@/lib/data/products'
import { type StoreState, useStore } from '../index'
import type { CartLine } from './cart-slice'
import { computeTotals } from './cart-pricing'

export interface CartItem extends CartLine {
	product: Product
	stock: number
}

const productById = new Map(catalogProducts.map(product => [product.id, product]))

/** Qatorlarni mahsulot ma'lumotlari bilan boyitadi (katalogda yo'qlari tushib qoladi) */
export const toCartItems = (lines: CartLine[]): CartItem[] =>
	lines.flatMap(line => {
		const product = productById.get(line.id)
		return product ? [{ ...line, product, stock: getStock(line.id) }] : []
	})

/*
 * Primitiv qiymat qaytaruvchi selektorlar — useStore bilan to'g'ridan-to'g'ri ishlatiladi.
 * Massiv/obyekt qaytaruvchi hosilalar uchun pastdagi hooklardan foydalaning
 * (har renderda yangi massiv qaytarish cheksiz qayta renderga olib keladi).
 */
export const selectCartCount = (state: StoreState) =>
	state.cartLines.reduce((sum, line) => sum + line.quantity, 0)

export const selectCartSubtotal = (state: StoreState) =>
	state.cartLines.reduce(
		(sum, line) => sum + (productById.get(line.id)?.price ?? 0) * line.quantity,
		0
	)

/** Mahsulotlarning o'z chegirmalari bo'yicha tejash */
export const selectCartSavings = (state: StoreState) =>
	state.cartLines.reduce((sum, line) => {
		const product = productById.get(line.id)
		return sum + (product ? (product.oldPrice - product.price) * line.quantity : 0)
	}, 0)

export const selectQuantityOf = (id: string) => (state: StoreState) =>
	state.cartLines.find(line => line.id === id)?.quantity ?? 0

/** Savatdagi mahsulotlar — qatorlar o'zgarmasa, o'sha massiv qaytadi */
export const useCartItems = () => {
	const lines = useStore(state => state.cartLines)
	return useMemo(() => toCartItems(lines), [lines])
}

/** Oraliq summa, promo, yetkazish va jami */
export const useCartTotals = () => {
	const subtotal = useStore(selectCartSubtotal)
	const promoPercent = useStore(state => state.promo?.percent ?? 0)
	return useMemo(() => computeTotals(subtotal, promoPercent), [subtotal, promoPercent])
}
