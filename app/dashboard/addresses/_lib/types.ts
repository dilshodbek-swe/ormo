export const ADDRESS_LABELS = ['Uy', 'Ish', 'Boshqa'] as const
export type AddressLabel = (typeof ADDRESS_LABELS)[number]

export const MAX_ADDRESSES = 10

export interface LatLng {
	lat: number
	lng: number
}

export interface AddressInput {
	label: AddressLabel
	fullName: string
	phone: string
	region: string
	city: string
	street: string
	isDefault: boolean
	/** Xaritada belgilangan nuqta */
	location?: LatLng | null
}

export interface Address extends AddressInput {
	id: string
}

export type AddressField = Exclude<keyof AddressInput, 'isDefault' | 'label'>

export type AddressResult =
	| { ok: true; addresses: Address[] }
	| { ok: false; error?: string; fieldErrors?: Partial<Record<AddressField, string>> }

/** "+998 90 123 45 67" ko'rinishi (saqlashda faqat raqamlar: 998901234567) */
export const formatPhone = (digits: string) => {
	const d = digits.replace(/\D/g, '')
	if (d.length !== 12) return digits
	return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`
}
