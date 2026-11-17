'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { catalogCategories, catalogProducts } from '@/lib/data/catalog'
import { DEFAULT_SORT, type SortId, sortProducts, sorts } from './sorts'

const DEFAULT_CATEGORY = 'all'

/** Filtrlar URL'da saqlanadi — havolani ulashsa, aynan shu ko'rinish ochiladi */
const useCatalogFilters = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const categoryParam = searchParams.get('category')
	const category = catalogCategories.some(item => item.id === categoryParam)
		? categoryParam!
		: DEFAULT_CATEGORY

	const sortParam = searchParams.get('sort') as SortId | null
	const sort: SortId = sorts.some(item => item.id === sortParam) ? sortParam! : DEFAULT_SORT

	const update = (key: 'category' | 'sort', value: string, fallback: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value === fallback) params.delete(key)
		else params.set(key, value)
		const query = params.toString()
		router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
	}

	const products = sortProducts(
		catalogProducts.filter(
			item => category === DEFAULT_CATEGORY || item.category === category
		),
		sort
	)

	return {
		category,
		sort,
		products,
		setCategory: (id: string) => update('category', id, DEFAULT_CATEGORY),
		setSort: (id: SortId) => update('sort', id, DEFAULT_SORT),
	}
}

export default useCatalogFilters
