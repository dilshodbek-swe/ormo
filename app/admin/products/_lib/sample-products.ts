import { catalogProducts } from '@/lib/data/catalog'
import { getProduct } from '@/lib/data/product-details'
import { type AdminProduct, type ProductStatus, suggestSku } from './types'

/*
 * Namunaviy mahsulotlar — do'kon katalogidan. Backend ulanganda `requireAdmin()` bilan
 * himoyalangan query keladi; UI faqat `AdminProduct` turiga tayanadi.
 */

/** Bir nechtasini qoralama/arxiv qilib qo'yamiz — filtrlar bo'sh qolmasin */
const STATUS_OVERRIDES: Record<string, ProductStatus> = {
	'oculus-rift-vr': 'draft',
	'vintage-50mm': 'archived',
	'dji-spark': 'draft',
}

export const sampleProducts: AdminProduct[] = catalogProducts.map((product, index) => {
	const details = getProduct(product.id)
	const stock = details?.stock

	return {
		id: product.id,
		name: product.name,
		brand: product.brand,
		category: product.category,
		description: details?.description ?? '',
		price: product.price,
		oldPrice: product.oldPrice,
		// Qoldiq ma'lumoti yo'q mahsulotlarga barqaror "tasodifiy" son
		stock: typeof stock === 'number' && Number.isFinite(stock) ? stock : (index * 7) % 23,
		sku: suggestSku(product.brand, product.name),
		status: STATUS_OVERRIDES[product.id] ?? 'active',
		images: (details?.images ?? [{ src: product.image }]).map((image, imageIndex) => ({
			id: `${product.id}-${imageIndex}`,
			url: image.src,
			name: image.src.split('/').pop() ?? 'rasm',
		})),
		specs: (details?.specs ?? []).map(([label, value], specIndex) => ({ id: `${product.id}-spec-${specIndex}`, label, value })),
		createdAt: `${product.addedAt}T10:00:00`,
		updatedAt: `${product.addedAt}T10:00:00`,
	}
})
