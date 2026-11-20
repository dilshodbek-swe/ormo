import { catalogCategories } from '@/lib/data/catalog'
import type { Product } from '@/lib/data/products'
import { productMatches } from '@/lib/data/search'

export const sorts = [
	{ id: 'newest', label: 'Yangi' },
	{ id: 'oldest', label: 'Eski' },
	{ id: 'price-asc', label: 'Arzon → qimmat' },
	{ id: 'price-desc', label: 'Qimmat → arzon' },
	{ id: 'name-asc', label: 'A → Z' },
	{ id: 'name-desc', label: 'Z → A' },
] as const

export type SortId = (typeof sorts)[number]['id']

export const pricePresets = [
	{ label: '3 mln gacha', min: null, max: 3_000_000 },
	{ label: '3 – 10 mln', min: 3_000_000, max: 10_000_000 },
	{ label: '10 – 15 mln', min: 10_000_000, max: 15_000_000 },
	{ label: '15 mln dan yuqori', min: 15_000_000, max: null },
] as const

export interface ShopFilters {
	query: string
	category: string
	minPrice: number | null
	maxPrice: number | null
	sort: SortId
}

export const DEFAULT_FILTERS: ShopFilters = {
	query: '',
	category: 'all',
	minPrice: null,
	maxPrice: null,
	sort: 'newest',
}

const toPrice = (value: string | null) => {
	const price = Number(value)
	return value && Number.isFinite(price) && price >= 0 ? price : null
}

/** URL → filtrlar (noto'g'ri qiymatlar e'tiborsiz qoldiriladi) */
export const parseFilters = (params: URLSearchParams): ShopFilters => {
	const category = params.get('category')
	const sort = params.get('sort')

	return {
		query: params.get('q') ?? DEFAULT_FILTERS.query,
		category: catalogCategories.some(item => item.id === category)
			? category!
			: DEFAULT_FILTERS.category,
		minPrice: toPrice(params.get('min')),
		maxPrice: toPrice(params.get('max')),
		sort: sorts.some(item => item.id === sort) ? (sort as SortId) : DEFAULT_FILTERS.sort,
	}
}

/** Filtrlar → URL (standart qiymatlar yozilmaydi) */
export const serializeFilters = (filters: ShopFilters) => {
	const params = new URLSearchParams()
	const query = filters.query.trim()

	if (query) params.set('q', query)
	if (filters.category !== DEFAULT_FILTERS.category) params.set('category', filters.category)
	if (filters.minPrice !== null) params.set('min', String(filters.minPrice))
	if (filters.maxPrice !== null) params.set('max', String(filters.maxPrice))
	if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort)

	return params.toString()
}

/** Tartiblashdan tashqari nechta filtr yoqilgan */
export const countActiveFilters = (filters: ShopFilters) =>
	[
		filters.query.trim() !== '',
		filters.category !== DEFAULT_FILTERS.category,
		filters.minPrice !== null || filters.maxPrice !== null,
	].filter(Boolean).length

const compare: Record<SortId, (a: Product, b: Product) => number> = {
	newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
	oldest: (a, b) => a.addedAt.localeCompare(b.addedAt),
	'price-asc': (a, b) => a.price - b.price,
	'price-desc': (a, b) => b.price - a.price,
	'name-asc': (a, b) => a.name.localeCompare(b.name),
	'name-desc': (a, b) => b.name.localeCompare(a.name),
}

export const applyFilters = (items: Product[], filters: ShopFilters) =>
	items
		.filter(item => filters.category === 'all' || item.category === filters.category)
		.filter(item => filters.minPrice === null || item.price >= filters.minPrice)
		.filter(item => filters.maxPrice === null || item.price <= filters.maxPrice)
		.filter(item => productMatches(item, filters.query))
		.sort(compare[filters.sort])
