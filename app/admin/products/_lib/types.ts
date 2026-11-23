import type { ProductCategory } from '@/lib/data/products'
import { slugify } from '@/lib/utils'

/*
 * Admin mahsulot modeli — backend (Mongoose `Product`) shu shaklga moslab yoziladi.
 * Hozircha UI to'liq client xotirasida ishlaydi.
 */

export const MAX_IMAGES = 10
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export type ProductStatus = 'active' | 'draft' | 'archived'

export const PRODUCT_STATUS: Record<ProductStatus, { label: string; hint: string; dot: string }> = {
	active: { label: 'Faol', hint: "Do'konda ko'rinadi", dot: 'bg-emerald-500' },
	draft: { label: 'Qoralama', hint: 'Faqat adminlarga', dot: 'bg-amber-500' },
	archived: { label: 'Arxiv', hint: 'Sotuvdan olingan', dot: 'bg-muted-foreground/50' },
}

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string }[] = [
	{ id: 'cameras', label: 'Kameralar' },
	{ id: 'drones', label: 'Dronlar' },
	{ id: 'stabilizers', label: 'Stabilizatorlar' },
	{ id: 'accessories', label: 'Aksessuarlar' },
]

export const categoryLabel = (id: ProductCategory) => PRODUCT_CATEGORIES.find(item => item.id === id)?.label ?? id

/** Kam qolgan deb hisoblanadigan qoldiq */
export const LOW_STOCK = 3

export interface ProductImage {
	id: string
	/** /images/... yoki yangi yuklangan fayl uchun blob: URL */
	url: string
	name: string
	/** Yangi tanlangan fayl — backend ulanganda shu yuklanadi (saqlangan rasmda yo'q) */
	file?: File
}

/** Texnik xususiyat: "Matritsa" → "APS-C, 24.2 MP". Tartib — ko'rsatilish tartibi */
export interface ProductSpec {
	id: string
	label: string
	value: string
}

export const MAX_SPECS = 30

/** Kategoriya bo'yicha tez qo'shiladigan xususiyat nomlari */
export const SPEC_PRESETS: Record<ProductCategory, string[]> = {
	cameras: ['Matritsa', 'Autofokus', 'Video', 'Ekran', 'Bayonet', 'Batareya', "Og'irligi"],
	drones: ['Kamera', 'Video', 'Parvoz vaqti', 'Masofa', 'Maksimal tezlik', 'Sensorlar', "Og'irligi"],
	stabilizers: ["O'qlar", "Yuk ko'tarish", 'Batareya', 'Ulanish', 'Rejimlar', "Og'irligi"],
	accessories: ['Turi', 'Mos keladi', 'Ulanish', 'Batareya', "O'lchami", "Og'irligi"],
}

export const newSpecId = () => `spec-${crypto.randomUUID()}`

export interface AdminProduct {
	id: string
	name: string
	brand: string
	category: ProductCategory
	description: string
	/** Sotuv narxi */
	price: number
	/** Chegirmagacha narx; chegirma bo'lmasa — price bilan teng yoki 0 */
	oldPrice: number
	stock: number
	sku: string
	status: ProductStatus
	/** Birinchisi — asosiy (cover) rasm */
	images: ProductImage[]
	specs: ProductSpec[]
	createdAt: string
	updatedAt: string
}

/** Formadagi qiymatlar — raqamlar ham matn ko'rinishida (bo'sh maydon uchun) */
export interface ProductDraft {
	name: string
	brand: string
	category: ProductCategory
	description: string
	price: string
	oldPrice: string
	stock: string
	sku: string
	status: ProductStatus
	images: ProductImage[]
	specs: ProductSpec[]
}

export type DraftErrors = Partial<Record<keyof ProductDraft, string>>

export const emptyDraft = (): ProductDraft => ({
	name: '',
	brand: '',
	category: 'cameras',
	description: '',
	price: '',
	oldPrice: '',
	stock: '0',
	sku: '',
	status: 'draft',
	images: [],
	specs: [],
})

export const draftFromProduct = (product: AdminProduct): ProductDraft => ({
	name: product.name,
	brand: product.brand,
	category: product.category,
	description: product.description,
	price: String(product.price),
	oldPrice: product.oldPrice > product.price ? String(product.oldPrice) : '',
	stock: String(product.stock),
	sku: product.sku,
	status: product.status,
	images: product.images,
	specs: product.specs,
})

/** Bo'sh qatorlar (ikkala katak ham bo'sh) saqlanmaydi */
export const cleanSpecs = (specs: ProductSpec[]) =>
	specs
		.map(spec => ({ ...spec, label: spec.label.trim(), value: spec.value.trim() }))
		.filter(spec => spec.label || spec.value)

/** Xatoli qatorlar: id → sabab (yarim to'ldirilgan yoki takroriy nom) */
export const getSpecErrors = (specs: ProductSpec[]) => {
	const errors: Record<string, string> = {}
	const seen = new Map<string, string>()
	for (const spec of cleanSpecs(specs)) {
		if (!spec.label) errors[spec.id] = 'Nomini kiriting'
		else if (!spec.value) errors[spec.id] = 'Qiymatini kiriting'
		const key = spec.label.toLowerCase()
		if (spec.label && seen.has(key)) errors[spec.id] = `«${spec.label}» takrorlangan`
		else if (spec.label) seen.set(key, spec.id)
	}
	return errors
}

/**
 * Matndan xususiyatlar: har qatorda "Nomi: qiymat", "Nomi — qiymat" yoki
 * Excel/Sheets'dan nusxalangan "Nomi<Tab>qiymat"
 */
export const parseSpecsText = (text: string): ProductSpec[] =>
	text
		.split(/\r?\n/)
		.map(line => line.trim())
		.filter(Boolean)
		.map(line => {
			const match = line.match(/^(.+?)\s*(?:\t|:|\s[—–-]\s)\s*(.+)$/)
			return match ? { id: newSpecId(), label: match[1].trim(), value: match[2].trim() } : null
		})
		.filter((spec): spec is ProductSpec => spec !== null)

/** "12 450 000" / "12450000" → 12450000; noto'g'ri bo'lsa NaN */
export const parseAmount = (value: string) => (value.trim() === '' ? NaN : Number(value.replace(/[\s_]/g, '')))

export const validateDraft = (draft: ProductDraft): DraftErrors => {
	const errors: DraftErrors = {}
	const price = parseAmount(draft.price)
	const oldPrice = parseAmount(draft.oldPrice)
	const stock = parseAmount(draft.stock)

	if (draft.name.trim().length < 2) errors.name = 'Nomi kamida 2 ta belgi'
	if (!draft.brand.trim()) errors.brand = 'Brendni kiriting'
	if (!Number.isFinite(price) || price <= 0) errors.price = "Narx musbat son bo'lishi kerak"
	if (draft.oldPrice.trim() && (!Number.isFinite(oldPrice) || oldPrice <= price))
		errors.oldPrice = 'Eski narx joriy narxdan katta bo‘lishi kerak'
	if (!Number.isInteger(stock) || stock < 0) errors.stock = 'Butun, manfiy bo‘lmagan son'
	if (draft.status === 'active' && draft.images.length === 0)
		errors.images = "Faol mahsulotda kamida bitta rasm bo'lishi shart"
	if (draft.images.length > MAX_IMAGES) errors.images = `Ko'pi bilan ${MAX_IMAGES} ta rasm`
	if (Object.keys(getSpecErrors(draft.specs)).length) errors.specs = "Xususiyatlar jadvalidagi xatolarni to'g'rilang"
	if (cleanSpecs(draft.specs).length > MAX_SPECS) errors.specs = `Ko'pi bilan ${MAX_SPECS} ta xususiyat`

	return errors
}

/** SKU taklifi: brend + nomdan, masalan "SONY-A6400" */
export const suggestSku = (brand: string, name: string) =>
	slugify(`${brand} ${name}`).toUpperCase().slice(0, 24)

export const getProductDiscount = (product: Pick<AdminProduct, 'price' | 'oldPrice'>) =>
	product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0
