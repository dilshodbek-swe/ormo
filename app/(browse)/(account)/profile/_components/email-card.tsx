'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { Mail } from 'lucide-react'

import { cn } from '@/lib/utils'
import SettingsCard from '../../_components/settings-card'

const Badge = ({ children, tone = 'muted' }: { children: string; tone?: 'muted' | 'success' | 'warning' }) => (
	<span
		className={cn(
			'rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase',
			tone === 'success' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
			tone === 'warning' && 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
			tone === 'muted' && 'text-muted-foreground'
		)}
	>
		{children}
	</span>
)

/** Akkauntga bog'langan email manzillar ro'yxati */
const EmailCard = ({ user }: { user: UserResource }) => {
	return (
		<SettingsCard
			title='Email manzillar'
			description='Buyurtma holati va tiklash kodlari asosiy manzilga yuboriladi.'
			hint='Email manzilni o‘zgartirish imkoniyati tez orada qo‘shiladi'
		>
			<ul className='divide-y border'>
				{user.emailAddresses.map(email => {
					const primary = email.id === user.primaryEmailAddressId
					const verified = email.verification.status === 'verified'

					return (
						<li key={email.id} className='flex flex-wrap items-center gap-3 px-4 py-3'>
							<Mail className='size-4 text-muted-foreground' />
							<span className='min-w-0 flex-1 truncate text-sm'>{email.emailAddress}</span>
							<div className='flex gap-1.5'>
								{primary && <Badge>Asosiy</Badge>}
								<Badge tone={verified ? 'success' : 'warning'}>
									{verified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
								</Badge>
							</div>
						</li>
					)
				})}
			</ul>
		</SettingsCard>
	)
}

export default EmailCard
