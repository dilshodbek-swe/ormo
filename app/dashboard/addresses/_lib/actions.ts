'use server'

import { isValidObjectId } from 'mongoose'

import { REGIONS } from '@/lib/data/regions'
import { UserModel } from '@/lib/db/models/user'
import { getCurrentUser } from '@/lib/db/users'
import { serializeAddresses } from './queries'
import {
	type AddressField,
	type AddressInput,
	ADDRESS_LABELS,
	type AddressResult,
	MAX_ADDRESSES,
} from './types'

/*
 * Server Action'lar to'g'ridan-to'g'ri POST bilan ham chaqirilishi mumkin —
 * shuning uchun har birida foydalanuvchi va kiruvchi ma'lumot qayta tekshiriladi.
 */

const UNAUTHORIZED: AddressResult = { ok: false, error: 'Avval akkauntga kiring' }
const FAILED: AddressResult = { ok: false, error: 'Saqlab bo‘lmadi. Birozdan so‘ng qayta urinib ko‘ring' }

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

/** +998 90 123-45-67, 90 123 45 67 va h.k. → 998901234567 */
const normalizePhone = (value: unknown) => {
	const digits = text(value, 32).replace(/\D/g, '')
	if (digits.length === 9) return `998${digits}`
	return digits.length === 12 && digits.startsWith('998') ? digits : null
}

const validate = (raw: unknown) => {
	const input = (raw ?? {}) as Record<string, unknown>
	const fieldErrors: Partial<Record<AddressField, string>> = {}

	const data = {
		label: (ADDRESS_LABELS as readonly string[]).includes(String(input.label))
			? (input.label as AddressInput['label'])
			: 'Boshqa',
		fullName: text(input.fullName, 80),
		phone: normalizePhone(input.phone) ?? '',
		region: text(input.region, 40),
		city: text(input.city, 60),
		street: text(input.street, 160),
		isDefault: input.isDefault === true,
	} satisfies AddressInput

	if (data.fullName.length < 2) fieldErrors.fullName = 'Qabul qiluvchining ismini kiriting'
	if (!data.phone) fieldErrors.phone = 'Raqam +998 XX XXX XX XX ko‘rinishida bo‘lsin'
	if (!(REGIONS as readonly string[]).includes(data.region)) fieldErrors.region = 'Viloyatni tanlang'
	if (data.city.length < 2) fieldErrors.city = 'Shahar yoki tumanni kiriting'
	if (data.street.length < 3) fieldErrors.street = 'Ko‘cha, uy va xonadonni kiriting'

	return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : { data }
}

/** Joriy foydalanuvchi va uning yangilangan manzillari */
const withUser = async (mutate: (clerkId: string, count: number) => Promise<AddressResult | void>) => {
	const user = await getCurrentUser()
	if (!user) return UNAUTHORIZED

	try {
		const failure = await mutate(user.clerkId, user.addresses.length)
		if (failure) return failure

		const fresh = await UserModel.findOne({ clerkId: user.clerkId }, { addresses: 1 }).lean()
		return { ok: true, addresses: serializeAddresses(fresh?.addresses ?? []) } satisfies AddressResult
	} catch (error) {
		console.error('[addresses]', error)
		return FAILED
	}
}

const clearDefault = (clerkId: string) =>
	UserModel.updateOne({ clerkId }, { $set: { 'addresses.$[].isDefault': false } })

/** Asosiy manzil qolmagan bo'lsa — birinchisini asosiy qiladi */
const ensureDefault = async (clerkId: string) => {
	const user = await UserModel.findOne({ clerkId }, { addresses: 1 }).lean()
	const addresses = user?.addresses ?? []
	if (addresses.length > 0 && !addresses.some(address => address.isDefault)) {
		await UserModel.updateOne({ clerkId }, { $set: { 'addresses.0.isDefault': true } })
	}
}

export const createAddress = async (raw: unknown): Promise<AddressResult> => {
	const result = validate(raw)
	if (!result.data) return { ok: false, fieldErrors: result.fieldErrors }
	const { data } = result

	return withUser(async (clerkId, count) => {
		if (count >= MAX_ADDRESSES) return { ok: false, error: `Ko‘pi bilan ${MAX_ADDRESSES} ta manzil saqlash mumkin` }

		// Birinchi manzil avtomatik asosiy bo'ladi
		const isDefault = data.isDefault || count === 0
		if (isDefault) await clearDefault(clerkId)
		await UserModel.updateOne({ clerkId }, { $push: { addresses: { ...data, isDefault } } })
	})
}

export const updateAddress = async (id: string, raw: unknown): Promise<AddressResult> => {
	if (!isValidObjectId(id)) return { ok: false, error: 'Manzil topilmadi' }
	const result = validate(raw)
	if (!result.data) return { ok: false, fieldErrors: result.fieldErrors }
	const { data } = result

	return withUser(async clerkId => {
		if (data.isDefault) await clearDefault(clerkId)
		const { label, fullName, phone, region, city, street } = data

		const { matchedCount } = await UserModel.updateOne(
			{ clerkId, 'addresses._id': id },
			{
				$set: {
					'addresses.$.label': label,
					'addresses.$.fullName': fullName,
					'addresses.$.phone': phone,
					'addresses.$.region': region,
					'addresses.$.city': city,
					'addresses.$.street': street,
					// Asosiylikni olib tashlash faqat boshqasini tanlash orqali
					...(data.isDefault && { 'addresses.$.isDefault': true }),
				},
			}
		)
		if (matchedCount === 0) return { ok: false, error: 'Manzil topilmadi' }
		await ensureDefault(clerkId)
	})
}

export const setDefaultAddress = async (id: string): Promise<AddressResult> => {
	if (!isValidObjectId(id)) return { ok: false, error: 'Manzil topilmadi' }

	return withUser(async clerkId => {
		await clearDefault(clerkId)
		await UserModel.updateOne({ clerkId, 'addresses._id': id }, { $set: { 'addresses.$.isDefault': true } })
		await ensureDefault(clerkId)
	})
}

export const deleteAddress = async (id: string): Promise<AddressResult> => {
	if (!isValidObjectId(id)) return { ok: false, error: 'Manzil topilmadi' }

	return withUser(async clerkId => {
		await UserModel.updateOne({ clerkId }, { $pull: { addresses: { _id: id } } })
		await ensureDefault(clerkId)
	})
}
