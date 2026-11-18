import { gadgets } from './gadgets'
import { type Product, type ProductCategory, products } from './products'

export const catalogCategories: { id: ProductCategory | 'all'; label: string }[] = [
	{ id: 'all', label: 'Barchasi' },
	{ id: 'cameras', label: 'Kameralar' },
	{ id: 'stabilizers', label: 'Stabilizatorlar' },
	{ id: 'drones', label: 'Dronlar' },
	{ id: 'accessories', label: 'Aksessuarlar' },
]

/** Gadjetlarni katalog mahsuloti ko'rinishiga keltiramiz (chegirmasiz) */
const gadgetProducts: Product[] = gadgets.map(gadget => ({
	id: gadget.id,
	category: gadget.category === 'Kamera' ? 'cameras' : 'accessories',
	brand: gadget.category,
	name: gadget.name,
	oldPrice: gadget.price,
	price: gadget.price,
	image: gadget.image,
	addedAt: gadget.addedAt,
}))

export const catalogProducts: Product[] = [...products, ...gadgetProducts]
