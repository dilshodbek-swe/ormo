'use client'

import { HandleSSOCallback } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuthRedirect } from '../../_lib/use-auth-redirect'

/** Google/GitHub'dan qaytgandan keyin sessiyani yakunlaydi yoki keyingi bosqichga yo'naltiradi */
const SSOCallbackHandler = () => {
	const router = useRouter()
	const { navigate } = useAuthRedirect()

	return (
		<div className='flex flex-col items-center gap-4 px-6 py-16 text-center'>
			<span className='relative flex size-12 items-center justify-center'>
				<span className='absolute inset-0 animate-ping rounded-full bg-foreground/10' />
				<Loader2 className='size-5 animate-spin' />
			</span>
			<div className='space-y-1'>
				<p className='font-space-grotesk text-lg font-bold tracking-tight'>Tekshirilmoqda…</p>
				<p className='text-sm text-muted-foreground'>Bir necha soniya, sizni tizimga kiritamiz</p>
			</div>

			<HandleSSOCallback
				navigateToApp={navigate}
				navigateToSignIn={() => router.replace('/sign-in')}
				navigateToSignUp={() => router.replace('/sign-up/continue')}
			/>
		</div>
	)
}

export default SSOCallbackHandler
