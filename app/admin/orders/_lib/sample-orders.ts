import { catalogProducts } from '@/lib/data/catalog'
import { type Order, type OrderItem, type OrderStatus, type OrderStep } from '@/lib/data/orders'
import { SHIPPING_FEE, FREE_SHIPPING_FROM } from '@/lib/store/cart/cart-pricing'

/*
 * Admin uchun namunaviy buyurtmalar — turli mijozlardan. Backend ulanganda bu modul o'rniga
 * `requireAdmin()` bilan himoyalangan query keladi; UI faqat `AdminOrder` turiga tayanadi.
 * Ma'lumot "seed"li tasodifiy generatordan — har safar bir xil chiqadi (hydration xavfsiz).
 */

export interface Customer {
	name: string
	phone: string
	email: string
	city: string
}

export interface AdminOrder extends Order {
	customer: Customer
}

const customers: Customer[] = [
	{ name: 'Aziza Karimova', phone: '+998 90 123 45 67', email: 'aziza.k@mail.uz', city: 'Toshkent' },
	{ name: 'Jasur Rahimov', phone: '+998 93 555 12 09', email: 'jasur.r@gmail.com', city: 'Samarqand' },
	{ name: 'Madina Yusupova', phone: '+998 97 410 88 31', email: 'madina.y@inbox.uz', city: 'Toshkent' },
	{ name: 'Bekzod Tursunov', phone: '+998 91 702 33 14', email: 'bekzod.t@gmail.com', city: 'Buxoro' },
	{ name: 'Nilufar Saidova', phone: '+998 99 018 64 52', email: 'nilufar.s@mail.uz', city: 'Andijon' },
	{ name: 'Sardor Aliyev', phone: '+998 94 381 27 70', email: 'sardor.a@gmail.com', city: 'Toshkent' },
	{ name: 'Dilnoza Ergasheva', phone: '+998 90 909 41 18', email: 'dilnoza.e@inbox.uz', city: "Farg'ona" },
	{ name: 'Otabek Nazarov', phone: '+998 95 266 70 03', email: 'otabek.n@gmail.com', city: 'Namangan' },
	{ name: 'Kamola Abdullayeva', phone: '+998 93 147 59 26', email: 'kamola.a@mail.uz', city: 'Toshkent' },
	{ name: 'Shoxrux Mirzayev', phone: '+998 97 833 02 61', email: 'shoxrux.m@gmail.com', city: 'Qarshi' },
	{ name: 'Gulnora Xolmatova', phone: '+998 91 520 76 44', email: 'gulnora.x@inbox.uz', city: 'Nukus' },
	{ name: 'Ulug‘bek Sobirov', phone: '+998 99 664 13 85', email: 'ulugbek.s@gmail.com', city: 'Toshkent' },
]

const streets: Record<string, string[]> = {
	Toshkent: ["Yunusobod tumani, Amir Temur ko'chasi 108", "Chilonzor tumani, Bunyodkor shoh ko'chasi 12", "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li 41"],
	Samarqand: ["Registon ko'chasi 5"],
	Buxoro: ["Bahouddin Naqshband ko'chasi 27"],
	Andijon: ["Bobur shoh ko'chasi 64"],
	"Farg'ona": ["Al-Farg'oniy ko'chasi 9"],
	Namangan: ["Navoiy ko'chasi 112"],
	Qarshi: ["Islom Karimov ko'chasi 3"],
	Nukus: ["Doslik guzari 18"],
}

const PAYMENTS = ['Click', 'Payme', 'Uzcard', 'Humo', 'Naqd pul']
const CANCEL_REASONS = ["Mijoz so'rovi bilan bekor qilindi", "To'lov tasdiqlanmadi", 'Omborda qolmagan']

/** "Hozir" — namunaviy ma'lumotlar shu nuqtaga nisbatan quriladi */
const ANCHOR = new Date('2026-11-23T16:30:00').getTime()
const HOUR = 3_600_000

/** Kichik, deterministik PRNG (mulberry32) */
const createRandom = (seed: number) => () => {
	seed |= 0
	seed = (seed + 0x6d2b79f5) | 0
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
	return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
}

const iso = (time: number) => {
	const date = new Date(time)
	const pad = (value: number) => String(value).padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

const generate = (): AdminOrder[] => {
	const random = createRandom(2026)
	const pick = <T,>(list: readonly T[]) => list[Math.floor(random() * list.length)]
	const result: AdminOrder[] = []
	let time = ANCHOR - 0.6 * HOUR

	for (let index = 0; index < 34; index++) {
		const customer = pick(customers)
		const lineCount = random() < 0.65 ? 1 : random() < 0.75 ? 2 : 3
		const items: OrderItem[] = []
		while (items.length < lineCount) {
			const product = pick(catalogProducts)
			if (items.some(line => line.product.id === product.id)) continue
			items.push({ product, quantity: random() < 0.85 ? 1 : 2, price: product.price })
		}

		const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0)
		const ageHours = (ANCHOR - time) / HOUR

		// Yoshiga qarab holat: yangilari tayyorlanmoqda, kechagilari yo'lda, eskilari yetkazilgan
		let status: OrderStatus =
			ageHours < 24 ? 'processing' : ageHours < 80 ? (random() < 0.8 ? 'shipped' : 'processing') : 'delivered'
		// Har 9 tadan biri bekor qilingan (eng yangisidan tashqari)
		if (index % 9 === 4) status = 'cancelled'

		const events: Partial<Record<OrderStep, string>> = { placed: iso(time) }
		const packedAt = time + (3 + random() * 5) * HOUR
		if ((status === 'processing' && packedAt < ANCHOR && random() < 0.6) || status === 'shipped' || status === 'delivered')
			events.packed = iso(Math.min(packedAt, ANCHOR - 0.2 * HOUR))
		if (status === 'shipped' || status === 'delivered') events.shipped = iso(time + (14 + random() * 8) * HOUR)
		if (status === 'delivered') events.delivered = iso(time + (40 + random() * 30) * HOUR)

		result.push({
			id: `ORM-${25_140 - index * 7 - Math.floor(random() * 6)}`,
			createdAt: iso(time),
			status,
			items,
			shipping: subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE,
			payment: pick(PAYMENTS),
			address: `${customer.city}, ${pick(streets[customer.city] ?? ['Markaziy ko‘cha 1'])}`,
			events,
			eta: status === 'processing' || status === 'shipped' ? iso(time + 72 * HOUR) : undefined,
			cancelReason: status === 'cancelled' ? pick(CANCEL_REASONS) : undefined,
			customer,
		})

		// Keyingi (eskiroq) buyurtma: 2–30 soat oldin
		time -= (2 + random() * 28) * HOUR
	}

	return result
}

export const adminOrders: AdminOrder[] = generate()

export const SAMPLE_NOW = ANCHOR
