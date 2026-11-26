import { bundles } from '@/lib/data/bundles'
import { bundleTotals, type AdminBundle } from './types'

/*
 * Namunaviy to'plamlar: do'kondagi 3 tasi (lib/data/bundles) + holatlarni ko'rsatish uchun yana 2 ta
 * (biri yashirin, birida arxivdagi mahsulot bor — ogohlantirish chiqadi).
 */

const SOLD = [38, 54, 21]

export const sampleBundles: AdminBundle[] = [
	...bundles.map((bundle, index) => {
		const productIds = bundle.products.map(product => product.id)
		return {
			id: bundle.id,
			name: bundle.name,
			tagline: bundle.tagline,
			discount: bundle.discount,
			productIds,
			visible: true,
			sold: SOLD[index] ?? 0,
			revenue: (SOLD[index] ?? 0) * bundleTotals(productIds, bundle.discount).total,
			createdAt: `2026-0${8 + index}-10T10:00:00`,
		}
	}),
	{
		id: 'studio-sound',
		name: 'Studiya ovozi',
		tagline: 'Kondensator mikrofon va monitor naushnik — podkast va vokal uchun.',
		discount: 7,
		productIds: ['studio-condenser-mic', 'wireless-monitor-headphones'],
		visible: false,
		sold: 0,
		revenue: 0,
		createdAt: '2026-11-20T10:00:00',
	},
	{
		id: 'retro',
		name: 'Retro kadr',
		tagline: 'Plyonka ruhidagi kadrlar: vintaj linza va chaqnoq.',
		discount: 12,
		productIds: ['vintage-50mm', 'nikon-sb-700', 'nikon-f4'],
		visible: true,
		sold: 6,
		revenue: 6 * bundleTotals(['vintage-50mm', 'nikon-sb-700', 'nikon-f4'], 12).total,
		createdAt: '2026-10-02T10:00:00',
	},
]
