import { catalogProducts } from '@/lib/data/catalog'

/** Muharrir tanlovi: qaysi mahsulot, qanday shior va qaysi xususiyatlar */
export const picks = [
	{
		id: 'dji-mavic-air-2',
		tagline: 'Osmondan 4K/60fps',
		specs: ['34 daq parvoz', '10 km masofa', '48 MP'],
	},
	{
		id: 'sony-a6400',
		tagline: 'Fokus — ko\'z ochib yumguncha',
		specs: ['0.02s autofokus', '4K video', '24.2 MP'],
	},
	{
		id: 'sigma-85mm-art',
		tagline: 'Portretlar qiroli',
		specs: ['f/1.4 diafragma', '11 parrakli bokeh', 'Sony E'],
	},
	{
		id: 'dji-osmo-pocket',
		tagline: 'Cho\'ntakdagi kino studiya',
		specs: ['3 o\'qli gimbal', '4K/60fps', '116 g'],
	},
].flatMap(pick => {
	const product = catalogProducts.find(item => item.id === pick.id)
	return product ? [{ ...pick, product }] : []
})

export type SpotlightPick = (typeof picks)[number]

export const AUTOPLAY_MS = 6000

export const pad = (n: number) => String(n).padStart(2, '0')
