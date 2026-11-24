import 'server-only'

import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'

import { getCurrentUser } from '@/lib/db/users'

/**
 * UI uchun: joriy foydalanuvchi admin'mi? `requireAdmin`dan farqi — hech qayerga yo'naltirmaydi
 * va baza ishlamasa sahifani buzmaydi (shunchaki tugma ko'rinmaydi).
 * Bu faqat ko'rinish uchun; himoya baribir /admin layout'idagi `requireAdmin()`da.
 */
export const getAdminState = cache(async (): Promise<{ userId: string | null; isAdmin: boolean }> => {
	const { userId } = await auth()
	if (!userId) return { userId: null, isAdmin: false }

	try {
		const user = await getCurrentUser()
		return { userId, isAdmin: user?.role === 'admin' }
	} catch (error) {
		console.error('[getAdminState] rolni aniqlab bo‘lmadi', error)
		return { userId, isAdmin: false }
	}
})
