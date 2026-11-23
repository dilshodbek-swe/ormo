import { catalogCategories } from '@/lib/data/catalog'
import { categories } from '@/lib/data/categories'
import type { AdminCategory } from './types'

/*
 * Namunaviy kategoriyalar — do'kon ma'lumotlaridan (bosh sahifadagi tartibda).
 * Backend ulanganda `requireAdmin()` bilan himoyalangan query keladi.
 */

const ACCESSORIES: AdminCategory = {
	id: 'accessories',
	title: catalogCategories.find(item => item.id === 'accessories')?.label ?? 'Aksessuarlar',
	description: 'Linzalar, mikrofonlar, chaqnoqlar va naushniklar — kadrni mukammal qiladigan mayda detallar.',
	image: { url: '/images/gadgets/sigma-85mm.png', name: 'sigma-85mm.png' },
	visible: false,
	createdAt: '2026-09-02T10:00:00',
	updatedAt: '2026-11-10T12:30:00',
}

export const sampleCategories: AdminCategory[] = [
	...categories.map((category, index) => ({
		id: category.id,
		title: category.title,
		description: category.description,
		image: { url: category.image, name: category.image.split('/').pop() ?? 'rasm' },
		visible: true,
		createdAt: `2026-0${6 + index}-15T10:00:00`,
		updatedAt: `2026-11-0${2 + index}T09:00:00`,
	})),
	ACCESSORIES,
]
