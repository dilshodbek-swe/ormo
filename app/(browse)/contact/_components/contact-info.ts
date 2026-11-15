// TODO: haqiqiy aloqa ma'lumotlari bilan almashtirish
export const contactInfo = {
	phone: '+998 71 200 00 00',
	phoneHref: 'tel:+998712000000',
	email: 'hello@ormo.uz',
	telegram: '@ormo_uz',
	telegramHref: 'https://t.me/ormo_uz',
	address: "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi",
	landmark: "Mo'ljal: Minor metro bekati",
}

/** Ish vaqti. Kunlar JS tartibida: 0 — yakshanba, 1 — dushanba ... */
export const openingHours: {
	label: string
	days: number[]
	open?: number
	close?: number
}[] = [
	{ label: 'Dushanba — Juma', days: [1, 2, 3, 4, 5], open: 9, close: 20 },
	{ label: 'Shanba', days: [6], open: 10, close: 18 },
	{ label: 'Yakshanba', days: [0] },
]
