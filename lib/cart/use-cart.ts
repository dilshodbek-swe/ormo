'use client'

import { useSyncExternalStore } from 'react'

import { catalogProducts } from '@/lib/data/catalog'
import { getStock } from '@/lib/data/product-details'
import { cartStore } from './cart-store'

const noopSubscribe = () => () => {}

/** Savat holati va amallari — har qanday client komponentdan */
const useCart = () => {
	const lines = useSyncExternalStore(
		cartStore.subscribe,
		cartStore.getSnapshot,
		cartStore.getServerSnapshot
	)

	// Serverda va hydration paytida false — savat faqat brauzerda ma'lum
	const hydrated = useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false
	)

	const items = lines.flatMap(line => {
		const product = catalogProducts.find(item => item.id === line.id)
		return product ? [{ ...line, product, stock: getStock(line.id) }] : []
	})

	return {
		hydrated,
		items,
		count: items.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
		savings: items.reduce(
			(sum, item) => sum + (item.product.oldPrice - item.product.price) * item.quantity,
			0
		),
		quantityOf: (id: string) => lines.find(line => line.id === id)?.quantity ?? 0,
		/** Ombordagi qoldiqdan oshirmasdan qo'shadi */
		add: (id: string, quantity = 1) => cartStore.add(id, quantity, getStock(id)),
		restore: cartStore.restore,
		setQuantity: cartStore.setQuantity,
		remove: cartStore.remove,
		clear: cartStore.clear,
	}
}

export default useCart
