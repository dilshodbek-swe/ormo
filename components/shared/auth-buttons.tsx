'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import UserMenu from './user-menu'

/** Headerdagi auth boshqaruvi: mehmonlarga kirish/ro'yxatdan o'tish, foydalanuvchiga avatar menyusi */
const AuthButtons = () => {
	const { isLoaded, isSignedIn } = useAuth()

	// Clerk yuklanguncha joy saqlab turamiz — header "sakramasin"
	if (!isLoaded) {
		return <span aria-hidden className='size-8 animate-pulse rounded-full bg-muted' />
	}

	if (isSignedIn) return <UserMenu />

	return (
		<>
			<Button variant='ghost' size='sm' nativeButton={false} render={<Link href='/sign-in' />}>
				Kirish
			</Button>
			<Button
				size='sm'
				nativeButton={false}
				render={<Link href='/sign-up' />}
				className='hidden sm:inline-flex'
			>
				Ro&apos;yxatdan o&apos;tish
			</Button>
		</>
	)
}

export default AuthButtons
