import type { UserRole } from '@/lib/db/models/user'

/** Client'ga uzatiladigan foydalanuvchi qatori (Mongo hujjatidan sodda obyekt) */
export interface AdminUserRow {
	/** Clerk ID — rolni o'zgartirishda shu ishlatiladi */
	id: string
	email: string
	username: string | null
	fullName: string
	imageUrl: string | null
	role: UserRole
	addressCount: number
	/** Asosiy manzil shahri (bo'lsa) */
	city: string | null
	createdAt: string
	lastSignInAt: string | null
}

export type RoleResult = { ok: true } | { ok: false; error: string }

export const ROLE_META: Record<UserRole, { label: string; hint: string }> = {
	customer: { label: 'Mijoz', hint: "Do'kondan xarid qiladi, o'z kabinetini ko'radi" },
	admin: { label: 'Admin', hint: "Admin panelga to'liq kirish: buyurtma, katalog, foydalanuvchilar" },
}
