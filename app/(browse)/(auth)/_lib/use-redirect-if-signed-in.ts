'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthRedirect } from './use-auth-redirect'

/** Tizimga kirgan foydalanuvchi auth sahifasiga tushsa, uni qaytish manziliga yuboramiz */
export const useRedirectIfSignedIn = () => {
	const { isSignedIn } = useAuth()
	const { redirectTo } = useAuthRedirect()
	const router = useRouter()

	useEffect(() => {
		if (isSignedIn) router.replace(redirectTo)
	}, [isSignedIn, redirectTo, router])

	return Boolean(isSignedIn)
}
