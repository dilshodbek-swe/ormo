import 'server-only'

import { forbidden, redirect } from 'next/navigation'
import { cache } from 'react'

import { getCurrentUser } from '@/lib/db/users'

/**
 * Admin huquqini tekshiradi (Data Access Layer). Rol Clerk'da emas, bizning bazada — `role: 'admin'`.
 * - Kirmagan → /sign-in (odatda proxy.ts buni oldinroq qiladi)
 * - Admin emas → 403 (app/forbidden.tsx)
 *
 * Layout'dagi tekshiruv faqat UI'ni yopadi: admin ma'lumotini o'qiydigan/o'zgartiradigan
 * har bir query, Server Action va Route Handler ham shu funksiyani chaqirishi SHART.
 * `cache` — bitta so'rov ichida bazaga qayta-qayta murojaat qilmaslik uchun.
 */
export const requireAdmin = cache(async () => {
	const user = await getCurrentUser()
	if (!user) redirect('/sign-in?redirect_url=/admin')
	if (user.role !== 'admin') forbidden()
	return user
})
