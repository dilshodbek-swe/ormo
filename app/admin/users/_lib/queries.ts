import 'server-only'

import { connection } from 'next/server'

import { requireAdmin } from '@/lib/auth/require-admin'
import { UserModel } from '@/lib/db/models/user'
import { connectDB } from '@/lib/db/mongoose'
import type { AdminUserRow } from './types'

type StoredUser = {
	clerkId: string
	email: string
	username?: string | null
	firstName?: string | null
	lastName?: string | null
	imageUrl?: string | null
	role?: 'customer' | 'admin' | null
	addresses?: { city?: string | null; isDefault?: boolean | null }[]
	createdAt?: Date
	lastSignInAt?: Date | null
}

/** Clerk'ning "bo'sh" standart rasmi — o'rniga bosh harflar ko'rsatamiz */
const isDefaultAvatar = (url?: string | null) => !url || url.includes('default') || url.includes('gravatar')

const serialize = (user: StoredUser): AdminUserRow => {
	const addresses = user.addresses ?? []
	const main = addresses.find(address => address.isDefault) ?? addresses[0]
	return {
		id: user.clerkId,
		email: user.email,
		username: user.username ?? null,
		fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
		imageUrl: isDefaultAvatar(user.imageUrl) ? null : (user.imageUrl ?? null),
		role: user.role === 'admin' ? 'admin' : 'customer',
		addressCount: addresses.length,
		city: main?.city ?? null,
		createdAt: (user.createdAt ?? new Date(0)).toISOString(),
		lastSignInAt: user.lastSignInAt ? user.lastSignInAt.toISOString() : null,
	}
}

/**
 * Barcha foydalanuvchilar (eng yangisi tepada) va so'rovni yuborgan admin ID'si.
 * Faqat adminlar uchun — himoya layout'ga emas, shu query'ning o'ziga ham qo'yilgan.
 */
export const getAdminUsers = async () => {
	// Har so'rovda yangidan (prerender qilinmaydi) — ro'yxat va sanalar doim joriy
	await connection()
	const admin = await requireAdmin()
	await connectDB()
	const users = await UserModel.find({}, { clerkId: 1, email: 1, username: 1, firstName: 1, lastName: 1, imageUrl: 1, role: 1, addresses: 1, createdAt: 1, lastSignInAt: 1 })
		.sort({ createdAt: -1 })
		.limit(500)
		.lean<StoredUser[]>()

	return { users: users.map(serialize), currentId: admin?.clerkId ?? null }
}
