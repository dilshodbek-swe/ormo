import { REGIONS } from '@/lib/data/regions'

/** Google'dan kelgan manzil qismlari (Geocoder va Places turlicha nomlaydi) */
interface Component {
	types: string[]
	long_name?: string
	longText?: string | null
}

export interface ResolvedAddress {
	region?: string
	city?: string
	street?: string
	formatted?: string
}

/** Viloyat nomini (ingliz/o'zbek/rus) bizning ro'yxatimizga moslaydi */
const REGION_STEMS: [RegExp, (typeof REGIONS)[number]][] = [
	[/andij/i, 'Andijon'],
	[/bu[kx]h?ar|бухар/i, 'Buxoro'],
	[/f[ae]rg|фарг/i, "Farg'ona"],
	[/jiz/i, 'Jizzax'],
	[/[kx]h?orazm|[kx]horezm|хорезм/i, 'Xorazm'],
	[/namang/i, 'Namangan'],
	[/navo/i, 'Navoiy'],
	[/[kq]ashq?k?adar|кашкадар/i, 'Qashqadaryo'],
	[/[kq]ara?k?alpa|qoraqalpo|каракалп/i, "Qoraqalpog'iston"],
	[/sama?r[kq]and|самарк/i, 'Samarqand'],
	[/s[iy]r ?dar|сырдар/i, 'Sirdaryo'],
	[/surk?[hx]?andar|surxondar|сурхандар/i, 'Surxondaryo'],
]

export const matchRegion = (name?: string | null) => {
	if (!name) return undefined
	if (/tash|tosh|ташк/i.test(name)) {
		return /region|viloyat|област/i.test(name) ? 'Toshkent viloyati' : 'Toshkent shahri'
	}
	return REGION_STEMS.find(([stem]) => stem.test(name))?.[1]
}

const pick = (components: Component[], ...types: string[]) => {
	for (const type of types) {
		const found = components.find(component => component.types.includes(type))
		const text = found?.longText ?? found?.long_name
		if (text) return text
	}
	return undefined
}

/** Manzil qismlaridan forma maydonlarini to'ldirish uchun qiymatlar */
export const resolveComponents = (components: Component[], formatted?: string | null): ResolvedAddress => {
	const route = pick(components, 'route')
	const number = pick(components, 'street_number')
	const premise = pick(components, 'premise', 'point_of_interest', 'establishment')

	return {
		region: matchRegion(pick(components, 'administrative_area_level_1')),
		city: pick(components, 'sublocality_level_1', 'sublocality', 'administrative_area_level_2', 'locality'),
		street: route ? [route, number].filter(Boolean).join(', ') : (premise ?? formatted?.split(',')[0]),
		formatted: formatted ?? undefined,
	}
}
