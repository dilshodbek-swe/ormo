import { catalogProducts } from '@/lib/data/catalog'
import type { Product } from '@/lib/data/products'
import { adminOrders, type Customer, SAMPLE_NOW } from '../../orders/_lib/sample-orders'

/*
 * Sharhlar moderatsiyasi. Mijoz sharhi avval "navbat"ga tushadi, admin tasdiqlaydi yoki yashiradi,
 * xohlasa javob yozadi. Do'kon hozircha faqat umumiy reytingni ko'rsatadi (product-details);
 * backend ulanganda tasdiqlangan sharhlar mahsulot sahifasida chiqadi va reyting shulardan hisoblanadi.
 */

export type ReviewStatus = 'pending' | 'published' | 'hidden'

export const STATUS_META: Record<ReviewStatus, { label: string; dot: string }> = {
	pending: { label: 'Navbatda', dot: 'bg-amber-500' },
	published: { label: 'Chop etilgan', dot: 'bg-emerald-500' },
	hidden: { label: 'Yashirilgan', dot: 'bg-muted-foreground/50' },
}
export const STATUS_ORDER: ReviewStatus[] = ['pending', 'published', 'hidden']

export interface Review {
	id: string
	product: Product
	customer: Customer
	rating: 1 | 2 | 3 | 4 | 5
	title: string
	text: string
	/** Shu mahsulotni bizdan sotib olganmi */
	verified: boolean
	helpful: number
	status: ReviewStatus
	createdAt: string
	reply?: { text: string; at: string }
	hiddenReason?: string
}

/** Diqqat talab qiladigan so'zlar — moderatorga belgi (avtomatik yashirmaydi) */
const FLAG_WORDS = ['buzilgan', 'singan', 'aldov', 'qalbaki', 'qaytar', 'pulimni', 'ishlamaydi', 'kech']
export const flagsOf = (review: Pick<Review, 'text' | 'title'>) => {
	const text = `${review.title} ${review.text}`.toLowerCase()
	return FLAG_WORDS.filter(word => text.includes(word))
}

const TEMPLATES: Record<Review['rating'], { title: string; text: string }[]> = {
	5: [
		{ title: 'Kutganimdan ham zo‘r', text: 'Ertasiga yetkazib berishdi, qadoq juda puxta. Birinchi kundanoq hammasi muammosiz ishlayapti.' },
		{ title: 'Narxiga arziydi', text: "Do'konda ko'rib, shu yerdan arzonroq topdim. Kuryer ham xushmuomala ekan, rahmat!" },
		{ title: 'Professional sifat', text: "Ish uchun oldim — kadrlar tiniq, avtofokus tez. Hamkasblarimga ham tavsiya qildim." },
		{ title: 'Ajoyib sovg‘a bo‘ldi', text: "Akamga tug'ilgan kuniga oldim, juda xursand bo'ldi. Qutisi ham chiroyli." },
	],
	4: [
		{ title: 'Yaxshi, lekin…', text: "Mahsulotning o'zi a'lo, faqat yo'riqnoma o'zbekcha emas ekan. Shunga bitta yulduz kam." },
		{ title: 'Deyarli mukammal', text: 'Batareya kutganimdan biroz tezroq tugaydi, qolgani hammasi joyida.' },
		{ title: 'Tavsiya qilaman', text: "Sifati yaxshi, yetkazish 2 kun oldi. Keyingi safar ham shu yerdan olaman." },
	],
	3: [
		{ title: "O'rtacha", text: "Ishlaydi, lekin kutganimdek emas. Rasmdagidan biroz kattaroq ekan." },
		{ title: 'Yetkazish kech qoldi', text: "Mahsulot yaxshi, ammo va'da qilingan kundan 3 kun kech keldi." },
	],
	2: [
		{ title: 'Qutisi ezilgan holda keldi', text: "Mahsulotga zarar yetmagan shekilli, lekin quti ezilgan edi. Qadoqlashga e'tibor bering." },
		{ title: 'Kutganim bu emas edi', text: "Tavsifda yozilgan bir funksiya bu modelda yo'q ekan. Qaytarishni o'ylayapman." },
	],
	1: [
		{ title: 'Ishlamaydi!', text: "Ikkinchi kuni yoqilmay qoldi. Pulimni qaytarishingizni so'rayman, aloqaga chiqing." },
		{ title: 'Qalbaki bo‘lishi mumkinmi?', text: 'Seriya raqami rasmiy saytda topilmadi. Aldov emasmi? Iltimos tekshirib bering.' },
	],
}

/** Kichik deterministik PRNG — har safar bir xil namunaviy sharhlar */
const createRandom = (seed: number) => () => {
	seed = (seed + 0x6d2b79f5) | 0
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
	return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
}

const pad = (value: number) => String(value).padStart(2, '0')
const iso = (time: number) => {
	const date = new Date(time)
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

const RATING_WEIGHTS: Review['rating'][] = [5, 5, 5, 5, 5, 4, 4, 4, 3, 3, 2, 1]

const generate = (): Review[] => {
	const random = createRandom(77)
	const pick = <T,>(list: readonly T[]) => list[Math.floor(random() * list.length)]
	const customers = [...new Map(adminOrders.map(order => [order.customer.name, order.customer])).values()]
	let time = SAMPLE_NOW - 0.4 * 3_600_000

	return Array.from({ length: 26 }, (_, index) => {
		const rating = pick(RATING_WEIGHTS)
		const template = pick(TEMPLATES[rating])
		const hoursAgo = (SAMPLE_NOW - time) / 3_600_000
		// Yangilari navbatda, eskilari ko'rib chiqilgan; past baholi eski sharhlarning ba'zisi yashirilgan
		const status: ReviewStatus = hoursAgo < 90 ? 'pending' : rating <= 2 && index % 3 === 0 ? 'hidden' : 'published'
		const review: Review = {
			id: `rev_${(index + 1).toString(36)}${Math.floor(random() * 1296).toString(36)}`,
			product: pick(catalogProducts),
			customer: pick(customers),
			rating,
			...template,
			verified: random() < 0.82,
			helpful: status === 'published' ? Math.floor(random() * 24) : 0,
			status,
			createdAt: iso(time),
			hiddenReason: status === 'hidden' ? 'Tekshirilmagan da’vo' : undefined,
			reply:
				status === 'published' && rating <= 3
					? { text: "Fikringiz uchun rahmat! Muammo bo'yicha siz bilan bog'lanamiz.", at: iso(time + 5 * 3_600_000) }
					: undefined,
		}
		time -= (3 + random() * 30) * 3_600_000
		return review
	})
}

export const sampleReviews = generate()

export const ratingStats = (list: Review[]) => {
	const counted = list.filter(review => review.status !== 'hidden')
	const distribution = [5, 4, 3, 2, 1].map(stars => ({ stars, count: counted.filter(review => review.rating === stars).length }))
	const average = counted.length ? counted.reduce((sum, review) => sum + review.rating, 0) / counted.length : 0
	const lowRated = list.filter(review => review.rating <= 2)
	const answered = lowRated.filter(review => review.reply).length
	return {
		average,
		distribution,
		total: counted.length,
		pending: list.filter(review => review.status === 'pending').length,
		/** Past baholarga javob berilgan ulush */
		responseRate: lowRated.length ? answered / lowRated.length : 1,
		verifiedRate: list.length ? list.filter(review => review.verified).length / list.length : 0,
	}
}

/** Tezkor javob shablonlari — bahoga qarab */
export const REPLY_TEMPLATES = [
	{ label: 'Rahmat', text: "Iliq fikringiz uchun katta rahmat! Ormo'ni tanlaganingizdan xursandmiz." },
	{ label: 'Uzr', text: "Noqulaylik uchun uzr so'raymiz. Operatorimiz 24 soat ichida siz bilan bog'lanadi." },
	{ label: 'Qaytarish', text: "Mahsulotni 14 kun ichida bepul qaytarishingiz mumkin. Buyurtmalar bo'limidan so'rov qoldiring." },
	{ label: 'Kafolat', text: "Mahsulot rasmiy kafolatga ega. Seriya raqamini support@ormo.uz ga yuboring — tekshirib beramiz." },
]
