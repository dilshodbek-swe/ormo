import type { Product } from '@/lib/data/products'
import { getDiscount } from '@/lib/utils'

export const sorts = [
	{ id: 'popular', label: 'Tavsiya' },
	{ id: 'price-asc', label: 'Arzonroq' },
	{ id: 'price-desc', label: 'Qimmatroq' },
	{ id: 'discount', label: 'Chegirma' },
] as const

export type SortId = (typeof sorts)[number]['id']

export const DEFAULT_SORT: SortId = 'popular'

export const sortProducts = (items: Product[], sort: SortId) => {
	const list = [...items]
	if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
	if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
	if (sort === 'discount')
		list.sort(
			(a, b) => getDiscount(b.oldPrice, b.price) - getDiscount(a.oldPrice, a.price)
		)
	return list
}
