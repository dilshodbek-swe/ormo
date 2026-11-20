'use client'

import { useUser } from '@clerk/nextjs'
import type { ReactNode } from 'react'

import AccountSkeleton from '../../_components/account-skeleton'
import PageHeader from '../../_components/page-header'
import ConnectedAccountsCard from './connected-accounts-card'
import DangerZoneCard from './danger-zone-card'
import NotificationsCard from './notifications-card'
import PasswordCard from './password-card'
import SessionsCard from './sessions-card'

const sections = [
	{ id: 'security', label: 'Xavfsizlik' },
	{ id: 'notifications', label: 'Bildirishnomalar' },
	{ id: 'danger', label: 'Xavfli zona' },
]

const Section = ({ id, label, children }: { id: string; label: string; children: ReactNode }) => (
	<section id={id} className='scroll-mt-24 space-y-4'>
		<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>{label}</h2>
		{children}
	</section>
)

const SettingsView = () => {
	const { user } = useUser()

	return (
		<>
			<PageHeader
				eyebrow='Akkaunt · Sozlamalar'
				title={
					<>
						Sozlamalar. <span className='text-muted-foreground'>Hammasi sizning qo&apos;lingizda.</span>
					</>
				}
			/>

			{/* Bo'limlarga tez o'tish */}
			<nav aria-label="Bo'limlar" className='mb-8 flex flex-wrap gap-2'>
				{sections.map(section => (
					<a
						key={section.id}
						href={`#${section.id}`}
						className='rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground'
					>
						{section.label}
					</a>
				))}
			</nav>

			{user ? (
				<div className='space-y-12'>
					<Section id='security' label='Xavfsizlik'>
						<PasswordCard user={user} />
						<SessionsCard user={user} />
						<ConnectedAccountsCard user={user} />
					</Section>
					<Section id='notifications' label='Bildirishnomalar'>
						<NotificationsCard user={user} />
					</Section>
					<Section id='danger' label='Xavfli zona'>
						<DangerZoneCard user={user} />
					</Section>
				</div>
			) : (
				<AccountSkeleton cards={3} />
			)}
		</>
	)
}

export default SettingsView
