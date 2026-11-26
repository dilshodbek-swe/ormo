import { sampleProducts } from '../../products/_lib/sample-products'
import type { AdminProduct } from '../../products/_lib/types'

/*
 * To'plam (bundle): 2–4 mahsulot birga olinsa qo'shimcha chegirma. Tartib — /deals sahifasidagi
 * yorliqlar tartibi. Backend ulanganda Mongoose `Bundle` (mahsulotlarga ref bilan).
 */

export const MIN_ITEMS = 2
export const MAX_ITEMS = 4
export const MAX_DISCOUNT = 40

export interface AdminBundle {
	id: string
	name: string
	tagline: string
	/** To'liq to'plamga qo'shimcha chegirma, % */
	discount: number
	productIds: string[]
	visible: boolean
	/** Statistika — buyurtmalardan */
	sold: number
	revenue: number
	createdAt: string
}

export interface BundleDraft {
	name: string
	tagline: string
	discount: number
	productIds: string[]
	visible: boolean
}

export const emptyBundleDraft = (): BundleDraft => ({ name: '', tagline: '', discount: 10, productIds: [], visible: true })

export const draftFromBundle = (bundle: AdminBundle): BundleDraft => ({
	name: bundle.name,
	tagline: bundle.tagline,
	discount: bundle.discount,
	productIds: bundle.productIds,
	visible: bundle.visible,
})

/** Admin mahsulotlari (narx, qoldiq, holat bilan) */
export const productMap = new Map(sampleProducts.map(product => [product.id, product]))
export const allProducts = sampleProducts

export const bundleProducts = (ids: string[]) => ids.map(id => productMap.get(id)).filter((product): product is AdminProduct => Boolean(product))

/** Hisob: alohida olsa → to'plam bilan; tejash */
export const bundleTotals = (ids: string[], discount: number) => {
	const subtotal = bundleProducts(ids).reduce((sum, product) => sum + product.price, 0)
	const savings = Math.round((subtotal * discount) / 100)
	return { subtotal, savings, total: subtotal - savings }
}

export interface BundleIssue {
	productId: string
	text: string
}

/** To'plamni sotib bo'lmaydigan holatlar: mahsulot tugagan, arxivda yoki qoralama */
export const bundleIssues = (ids: string[]): BundleIssue[] =>
	bundleProducts(ids).flatMap(product =>
		product.status === 'archived'
			? [{ productId: product.id, text: `${product.name} — arxivda` }]
			: product.status === 'draft'
				? [{ productId: product.id, text: `${product.name} — qoralama` }]
				: product.stock === 0
					? [{ productId: product.id, text: `${product.name} — omborda yo'q` }]
					: []
	)

/** Ombordagi qoldiqqa ko'ra nechta to'liq to'plam yig'ish mumkin */
export const bundleCapacity = (ids: string[]) => {
	const products = bundleProducts(ids)
	return products.length ? Math.min(...products.map(product => product.stock)) : 0
}

export type BundleErrors = Partial<Record<'name' | 'productIds' | 'discount', string>>

export const validateBundle = (draft: BundleDraft, takenNames: string[]): BundleErrors => {
	const errors: BundleErrors = {}
	if (draft.name.trim().length < 2) errors.name = 'Nomi kamida 2 belgi'
	else if (takenNames.includes(draft.name.trim().toLowerCase())) errors.name = 'Bunday nomli to‘plam bor'
	if (draft.productIds.length < MIN_ITEMS) errors.productIds = `Kamida ${MIN_ITEMS} ta mahsulot tanlang`
	else if (draft.productIds.length > MAX_ITEMS) errors.productIds = `Ko'pi bilan ${MAX_ITEMS} ta`
	if (draft.discount < 1 || draft.discount > MAX_DISCOUNT) errors.discount = `1% dan ${MAX_DISCOUNT}% gacha`
	return errors
}
