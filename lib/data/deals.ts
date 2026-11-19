import { getDiscount } from '@/lib/utils'
import { products } from './products'

/** Chegirmadagi mahsulotlar — eng katta chegirmadan boshlab */
export const deals = products
	.filter(product => product.price < product.oldPrice)
	.map(product => ({ ...product, discount: getDiscount(product.oldPrice, product.price) }))
	.sort((a, b) => b.discount - a.discount)

export type Deal = (typeof deals)[number]

export const maxDiscount = Math.max(...deals.map(deal => deal.discount))
