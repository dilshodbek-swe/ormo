'use client'

import type { OAuthStrategy, UserResource } from '@clerk/nextjs/types'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { oauthProviders } from '@/components/shared/brand-icons'
import FormAlert from '@/components/shared/form-alert'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/clerk/errors'
import SettingsCard from '../../_components/settings-card'

/** Google/GitHub akkauntlarini ulash va uzish */
const ConnectedAccountsCard = ({ user }: { user: UserResource }) => {
	const [pending, setPending] = useState<OAuthStrategy | null>(null)
	const [error, setError] = useState<string>()

	// Parol yo'q va bitta ulangan akkaunt qolgan bo'lsa — uni uzish akkauntni "qulflab" qo'yadi
	const isLastSignInMethod = !user.passwordEnabled && user.externalAccounts.length <= 1

	const connect = async (strategy: OAuthStrategy) => {
		setError(undefined)
		setPending(strategy)
		try {
			const account = await user.createExternalAccount({
				strategy,
				redirectUrl: window.location.href,
			})
			const url = account.verification?.externalVerificationRedirectURL
			if (url) window.location.assign(url.href)
		} catch (caught) {
			setError(errorMessage(caught))
			setPending(null)
		}
	}

	const disconnect = async (strategy: OAuthStrategy, destroy: () => Promise<void>) => {
		setError(undefined)
		setPending(strategy)
		try {
			await destroy()
			await user.reload()
		} catch (caught) {
			setError(errorMessage(caught))
		} finally {
			setPending(null)
		}
	}

	return (
		<SettingsCard
			title='Ulangan akkauntlar'
			description='Bir bosishda kirish uchun Google yoki GitHub akkauntingizni ulang.'
		>
			<ul className='divide-y border'>
				{oauthProviders.map(({ strategy, provider, label, icon: Icon }) => {
					const account = user.externalAccounts.find(item => item.provider === provider)
					const verified = account?.verification?.status === 'verified'
					const busy = pending === strategy

					return (
						<li key={strategy} className='flex items-center gap-3 px-4 py-3'>
							<span className='flex size-9 items-center justify-center rounded-full border'>
								<Icon />
							</span>
							<div className='min-w-0 flex-1'>
								<p className='text-sm font-medium'>{label}</p>
								<p className='truncate text-xs text-muted-foreground'>
									{account && verified ? account.emailAddress || account.username : 'Ulanmagan'}
								</p>
							</div>
							{account && verified ? (
								<Button
									variant='outline'
									size='sm'
									disabled={busy || isLastSignInMethod}
									title={isLastSignInMethod ? "Avval parol o'rnating — bu yagona kirish usulingiz" : undefined}
									onClick={() => disconnect(strategy, () => account.destroy())}
								>
									{busy && <Loader2 className='animate-spin' />}
									Uzish
								</Button>
							) : (
								<Button size='sm' disabled={busy} onClick={() => connect(strategy)}>
									{busy && <Loader2 className='animate-spin' />}
									Ulash
								</Button>
							)}
						</li>
					)
				})}
			</ul>
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default ConnectedAccountsCard
