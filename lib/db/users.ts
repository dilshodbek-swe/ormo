import 'server-only'

import { currentUser, type UserJSON } from '@clerk/nextjs/server'

import { connectDB } from './mongoose'
import { type User, UserModel } from './models/user'

type ClerkProfile = Pick<User, 'clerkId' | 'email' | 'username' | 'firstName' | 'lastName' | 'imageUrl' | 'lastSignInAt'>

/** Webhook'dan kelgan Clerk foydalanuvchisini bizning maydonlarga o'giradi */
export const profileFromWebhook = (data: UserJSON): ClerkProfile => {
	const primary =
		data.email_addresses.find(item => item.id === data.primary_email_address_id) ?? data.email_addresses[0]

	return {
		clerkId: data.id,
		email: primary?.email_address ?? '',
		username: data.username ?? undefined,
		firstName: data.first_name ?? undefined,
		lastName: data.last_name ?? undefined,
		imageUrl: data.image_url,
		lastSignInAt: data.last_sign_in_at ? new Date(data.last_sign_in_at) : undefined,
	}
}

/** Profilni yaratadi yoki yangilaydi. Rol va manzillar kabi o'z maydonlarimizga tegmaydi. */
export const upsertUser = async (profile: ClerkProfile) => {
	await connectDB()
	return UserModel.findOneAndUpdate(
		{ clerkId: profile.clerkId },
		{ $set: profile },
		{ upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
	)
}

export const deleteUser = async (clerkId: string) => {
	await connectDB()
	await UserModel.deleteOne({ clerkId })
}

/**
 * Joriy foydalanuvchining bazadagi yozuvi (Server Component / Route Handler / Server Action uchun).
 * Webhook hali yetib kelmagan bo'lsa (yoki lokalda sozlanmagan bo'lsa) — Clerk'dan olib yaratadi.
 */
export const getCurrentUser = async () => {
	const clerkUser = await currentUser()
	if (!clerkUser) return null

	await connectDB()
	const existing = await UserModel.findOne({ clerkId: clerkUser.id })
	if (existing) return existing

	return upsertUser({
		clerkId: clerkUser.id,
		email: clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? '',
		username: clerkUser.username ?? undefined,
		firstName: clerkUser.firstName ?? undefined,
		lastName: clerkUser.lastName ?? undefined,
		imageUrl: clerkUser.imageUrl,
		lastSignInAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : undefined,
	})
}
