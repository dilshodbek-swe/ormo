import 'server-only'

import { getCurrentUser } from '@/lib/db/users'
import { type Address, ADDRESS_LABELS, type AddressLabel } from './types'

type StoredAddress = {
	_id: { toString(): string }
	label?: string | null
	fullName: string
	phone: string
	region: string
	city: string
	street: string
	isDefault?: boolean | null
	location?: { lat?: number | null; lng?: number | null } | null
}

/** Mongo subhujjatlarini client'ga xavfsiz uzatiladigan oddiy obyektlarga aylantiradi */
export const serializeAddresses = (addresses: StoredAddress[]): Address[] =>
	addresses
		.map(address => ({
			id: address._id.toString(),
			label: (ADDRESS_LABELS as readonly string[]).includes(address.label ?? '')
				? (address.label as AddressLabel)
				: 'Boshqa',
			fullName: address.fullName,
			phone: address.phone,
			region: address.region,
			city: address.city,
			street: address.street,
			isDefault: Boolean(address.isDefault),
			location:
				typeof address.location?.lat === 'number' && typeof address.location?.lng === 'number'
					? { lat: address.location.lat, lng: address.location.lng }
					: null,
		}))
		// Asosiy manzil doim birinchi
		.sort((a, b) => Number(b.isDefault) - Number(a.isDefault))

/** Joriy foydalanuvchining manzillari (bazada hali yo'q bo'lsa — yaratiladi) */
export const getAddresses = async () => {
	const user = await getCurrentUser()
	if (!user) return []
	return serializeAddresses(user.addresses as unknown as StoredAddress[])
}
