import { catalogProducts } from './catalog'
import type { Product } from './products'

interface BundleDefinition {
	id: string
	name: string
	tagline: string
	/** To'liq to'plam olinganda qo'shimcha chegirma, % */
	discount: number
	productIds: string[]
}

const definitions: BundleDefinition[] = [
	{
		id: 'portrait',
		name: 'Portret ustasi',
		tagline: 'Kamera, afsonaviy linza va chaqnoq — studiya portretlari uchun.',
		discount: 10,
		productIds: ['sony-a6400', 'sigma-85mm-art', 'nikon-sb-700'],
	},
	{
		id: 'vlog',
		name: 'Vlog boshlang\'ich',
		tagline: 'Cho\'ntak gimbal, simsiz mikrofon va monitor naushnik.',
		discount: 12,
		productIds: ['dji-osmo-pocket', 'wireless-handheld-mic', 'wireless-monitor-headphones'],
	},
	{
		id: 'travel',
		name: 'Sayohatchi',
		tagline: 'Osmondan, suv ostidan va qo\'ldan — hamma burchakdan kadr.',
		discount: 8,
		productIds: ['dji-mavic-air-2', 'dji-osmo-action', 'dji-osmo-pocket'],
	},
]

export interface Bundle extends Omit<BundleDefinition, 'productIds'> {
	products: Product[]
}

export const bundles: Bundle[] = definitions.map(({ productIds, ...bundle }) => ({
	...bundle,
	products: productIds.flatMap(id => catalogProducts.filter(product => product.id === id)),
}))

/** Tanlangan mahsulotlar bo'yicha hisob: chegirma faqat to'liq to'plamga */
export const getBundleTotals = (bundle: Bundle, selectedIds: ReadonlySet<string>) => {
	const selected = bundle.products.filter(product => selectedIds.has(product.id))
	const subtotal = selected.reduce((sum, product) => sum + product.price, 0)
	const fullSubtotal = bundle.products.reduce((sum, product) => sum + product.price, 0)
	const isComplete = selected.length === bundle.products.length
	const bundleSavings = Math.round((fullSubtotal * bundle.discount) / 100)

	return {
		count: selected.length,
		missing: bundle.products.length - selected.length,
		isComplete,
		subtotal,
		total: isComplete ? subtotal - bundleSavings : subtotal,
		/** To'liq to'plamdagi tejash — to'liq bo'lmasa, "qo'shsangiz" eslatmasi uchun */
		bundleSavings,
	}
}
