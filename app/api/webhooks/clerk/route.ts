import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { NextRequest } from 'next/server'

import { deleteUser, profileFromWebhook, upsertUser } from '@/lib/db/users'

/**
 * Clerk → MongoDB sinxronizatsiyasi.
 * Clerk Dashboard → Webhooks'da shu manzilni qo'shing va `user.created`, `user.updated`,
 * `user.deleted` hodisalarini belgilang. Imzo `CLERK_WEBHOOK_SIGNING_SECRET` bilan tekshiriladi.
 */
export const POST = async (request: NextRequest) => {
	let event
	try {
		event = await verifyWebhook(request)
	} catch {
		return new Response('Imzo noto‘g‘ri', { status: 400 })
	}

	try {
		switch (event.type) {
			case 'user.created':
			case 'user.updated':
				await upsertUser(profileFromWebhook(event.data))
				break
			case 'user.deleted':
				if (event.data.id) await deleteUser(event.data.id)
				break
		}
	} catch (error) {
		console.error('[clerk-webhook]', event.type, error)
		// 500 qaytsa Clerk (Svix) hodisani keyinroq qayta yuboradi
		return new Response('Server xatosi', { status: 500 })
	}

	return new Response('OK')
}
