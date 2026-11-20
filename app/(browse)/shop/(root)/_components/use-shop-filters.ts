'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { catalogProducts } from '@/lib/data/catalog'
import {
	applyFilters,
	countActiveFilters,
	DEFAULT_FILTERS,
	parseFilters,
	serializeFilters,
	type ShopFilters,
} from './shop-filters'

/**
 * Filtrlar holati. Boshlang'ich qiymat URL'dan olinadi, har o'zgarish URL'ga yoziladi —
 * havolani ulashsa, aynan shu ko'rinish ochiladi.
 * history.replaceState sahifani qayta yuklamaydi va qidiruv yozilayotganda kursorni buzmaydi.
 */
const useShopFilters = () => {
	const searchParams = useSearchParams()
	const [filters, setFilters] = useState(() => parseFilters(searchParams))

	/*
	 * URL tashqaridan o'zgarsa (masalan, header'dagi qidiruv /shop?q=... ga o'tkazsa) — filtrlarni
	 * qayta o'qiymiz. O'zimiz yozgan replaceState URL'i serializeFilters bilan bir xil bo'ladi,
	 * shuning uchun u e'tiborsiz qoladi va yozilayotgan matn (masalan, oxiridagi bo'shliq) buzilmaydi.
	 */
	const urlKey = searchParams.toString()
	const [syncedKey, setSyncedKey] = useState(urlKey)
	if (urlKey !== syncedKey) {
		setSyncedKey(urlKey)
		if (urlKey !== serializeFilters(filters)) setFilters(parseFilters(searchParams))
	}

	const update = (patch: Partial<ShopFilters>) => {
		const next = { ...filters, ...patch }
		setFilters(next)

		const query = serializeFilters(next)
		window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
	}

	return {
		filters,
		update,
		reset: () => update(DEFAULT_FILTERS),
		activeCount: countActiveFilters(filters),
		products: applyFilters(catalogProducts, filters),
	}
}

export default useShopFilters
