'use client'

import { useState } from 'react'

import { type Bundle, getBundleTotals } from '@/lib/data/bundles'

/** To'plamdagi qaysi mahsulotlar tanlangan (boshida — hammasi) va hisob-kitob */
const useBundleSelection = (bundle: Bundle) => {
	const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
		() => new Set(bundle.products.map(product => product.id))
	)

	const toggle = (id: string) =>
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})

	return {
		isSelected: (id: string) => selectedIds.has(id),
		toggle,
		totals: getBundleTotals(bundle, selectedIds),
	}
}

export default useBundleSelection
