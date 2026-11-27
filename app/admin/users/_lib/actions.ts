'use server'

import { refresh } from 'next/cache'

import { requireAdmin } from '@/lib/auth/require-admin'
import { USER_ROLES, type UserRole, UserModel } from '@/lib/db/models/user'
import { connectDB } from '@/lib/db/mongoose'
import type { RoleResult } from './types'

/*
 * Server Action to'g'ridan-to'g'ri POST bilan ham chaqirilishi mumkin — shuning uchun
 * har safar admin huquqi va kiruvchi qiymatlar qayta tekshiriladi.
 */

export const setUserRole = async (clerkId: unknown, role: unknown): Promise<RoleResult> => {
	const admin = await requireAdmin()

	if (typeof clerkId !== 'string' || !clerkId.trim()) return { ok: false, error: 'Foydalanuvchi topilmadi' }
	if (!(USER_ROLES as readonly unknown[]).includes(role)) return { ok: false, error: "Noma'lum rol" }
	const nextRole = role as UserRole

	// O'zini admin rolidan chiqarib qo'yib, panelga kira olmay qolmasin
	if (admin && admin.clerkId === clerkId && nextRole !== 'admin') {
		return { ok: false, error: "O'zingizning admin rolingizni olib bo'lmaydi" }
	}

	try {
		await connectDB()
		const target = await UserModel.findOne({ clerkId }, { role: 1 }).lean<{ role?: UserRole }>()
		if (!target) return { ok: false, error: 'Foydalanuvchi topilmadi' }
		if (target.role === nextRole) return { ok: true }

		// Oxirgi admin qolmasa — do'kon boshqaruvsiz qoladi
		if (target.role === 'admin' && nextRole !== 'admin') {
			const admins = await UserModel.countDocuments({ role: 'admin' })
			if (admins <= 1) return { ok: false, error: 'Bu yagona admin — avval boshqasini admin qiling' }
		}

		await UserModel.updateOne({ clerkId }, { $set: { role: nextRole } })
	} catch (error) {
		console.error('[setUserRole]', error)
		return { ok: false, error: 'Saqlab bo‘lmadi. Birozdan so‘ng qayta urinib ko‘ring' }
	}

	refresh()
	return { ok: true }
}
