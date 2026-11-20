'use client'

import { useSignIn } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/nextjs/types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { oauthProviders as providers } from '@/components/shared/brand-icons'
import { Button } from '@/components/ui/button'
import { translateError } from '@/lib/clerk/errors'
import { useAuthRedirect } from '../_lib/use-auth-redirect'

/**
 * Ijtimoiy tarmoqlar orqali kirish. Kirish ham, ro'yxatdan o'tish ham bitta
 * `signIn.sso()` orqali ishlaydi — yangi foydalanuvchini Clerk o'zi sign-up'ga o'tkazadi.
 */
const OAuthButtons = ({ onError }: { onError: (message?: string) => void }) => {
	const { signIn } = useSignIn()
	const { redirectTo } = useAuthRedirect()
	const [pending, setPending] = useState<OAuthStrategy | null>(null)

	const start = async (strategy: OAuthStrategy) => {
		setPending(strategy)
		onError(undefined)

		const { error } = await signIn.sso({
			strategy,
			redirectUrl: redirectTo,
			redirectCallbackUrl: '/sso-callback',
		})

		// Muvaffaqiyatli bo'lsa sahifa provayderga ketadi, shuning uchun faqat xatoni ushlaymiz
		if (error) {
			onError(translateError(error))
			setPending(null)
		}
	}

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-2 gap-3'>
				{providers.map(({ strategy, label, icon: Icon }) => (
					<Button
						key={strategy}
						type='button'
						variant='outline'
						disabled={pending !== null}
						onClick={() => start(strategy)}
						className='h-10'
					>
						{pending === strategy ? <Loader2 className='animate-spin' /> : <Icon />}
						{label}
					</Button>
				))}
			</div>

			<div className='flex items-center gap-3 text-xs text-muted-foreground uppercase'>
				<span className='h-px flex-1 bg-border' />
				yoki
				<span className='h-px flex-1 bg-border' />
			</div>
		</div>
	)
}

export default OAuthButtons
