import { catalogCategories, catalogProducts } from './catalog'
import type { Product } from './products'

const categoryLabel = (id: string) =>
	catalogCategories.find(item => item.id === id)?.label ?? ''

/** Mahsulot so'rovga mosmi: brend, nom yoki kategoriya bo'yicha (katta-kichik harf farqsiz) */
export const productMatches = (product: Product, query: string) => {
	const needle = query.trim().toLowerCase()
	if (!needle) return true
	return `${product.brand} ${product.name} ${categoryLabel(product.category)}`
		.toLowerCase()
		.includes(needle)
}

/** Butun katalog bo'yicha qidiruv — header'dagi tezkor qidiruv va do'kon uchun bir xil */
export const searchProducts = (query: string, limit = Infinity) =>
	catalogProducts.filter(product => productMatches(product, query)).slice(0, limit)
