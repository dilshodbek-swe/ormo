import { slugify } from '@/lib/utils'
import type { AdminProduct } from '../../products/_lib/types'

/*
 * Admin kategoriya modeli — backend (Mongoose `Category`) shu shaklga moslab yoziladi.
 * `order` — do'kon bosh sahifasi va katalogdagi tartib; birinchisi bosh sahifada katta karta.
 */

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export interface CategoryImage {
	url: string
	name: string
	/** Yangi tanlangan fayl — backend ulanganda storage'ga yuklanadi */
	file?: File
}

export interface AdminCategory {
	/** URL'dagi nom: /catalog?category=<id> */
	id: string
	title: string
	description: string
	image: CategoryImage | null
	/** Do'konda ko'rinadimi */
	visible: boolean
	createdAt: string
	updatedAt: string
}

export interface CategoryDraft {
	title: string
	slug: string
	/** Slug qo'lda o'zgartirilganmi (aks holda nomdan avtomatik) */
	slugTouched: boolean
	description: string
	image: CategoryImage | null
	visible: boolean
}

export type CategoryErrors = Partial<Record<'title' | 'slug' | 'description' | 'image', string>>

export const emptyCategoryDraft = (): CategoryDraft => ({
	title: '',
	slug: '',
	slugTouched: false,
	description: '',
	image: null,
	visible: true,
})

export const draftFromCategory = (category: AdminCategory): CategoryDraft => ({
	title: category.title,
	slug: category.id,
	slugTouched: true,
	description: category.description,
	image: category.image,
	visible: category.visible,
})

export const DESCRIPTION_LIMIT = 160

export const validateCategory = (draft: CategoryDraft, takenSlugs: string[]): CategoryErrors => {
	const errors: CategoryErrors = {}
	const slug = draft.slug.trim()
	if (draft.title.trim().length < 2) errors.title = 'Nomi kamida 2 ta belgi'
	if (!slug) errors.slug = 'Manzilni kiriting'
	else if (slug !== slugify(slug)) errors.slug = 'Faqat kichik lotin harflari, raqam va "-"'
	else if (takenSlugs.includes(slug)) errors.slug = `«${slug}» band — boshqa nom tanlang`
	if (draft.description.length > DESCRIPTION_LIMIT) errors.description = `Ko'pi bilan ${DESCRIPTION_LIMIT} belgi`
	if (draft.visible && !draft.image) errors.image = "Do'konda ko'rinadigan kategoriyaga rasm kerak"
	return errors
}

/** Har bir kategoriya rangi — tartibdagi o'rniga qarab (ulush chizig'i va belgilar uchun) */
export const CATEGORY_TONES = ['bg-sky-500', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-cyan-500', 'bg-lime-500', 'bg-fuchsia-500']
export const toneAt = (index: number) => CATEGORY_TONES[index % CATEGORY_TONES.length]

export interface CategoryStats {
	total: number
	active: number
	units: number
	value: number
	discounted: number
}

export const getCategoryStats = (id: string, products: AdminProduct[]): CategoryStats => {
	const own = products.filter(product => product.category === id)
	return {
		total: own.length,
		active: own.filter(product => product.status === 'active').length,
		units: own.reduce((sum, product) => sum + product.stock, 0),
		value: own.reduce((sum, product) => sum + product.stock * product.price, 0),
		discounted: own.filter(product => product.oldPrice > product.price).length,
	}
}
