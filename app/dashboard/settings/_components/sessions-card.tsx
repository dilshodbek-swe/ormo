'use client'

import { useSession } from '@clerk/nextjs'
import type { SessionWithActivitiesResource, UserResource } from '@clerk/nextjs/types'
import { Laptop, Loader2, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/clerk/errors'
import { formatRelative } from '@/lib/utils'
import SettingsCard from '../../_components/settings-card'

/** Akkaunt ochiq turgan qurilmalar; boshqalaridan masofadan chiqish mumkin */
const SessionsCard = ({ user }: { user: UserResource }) => {
	const { session: current } = useSession()
	const [sessions, setSessions] = useState<SessionWithActivitiesResource[] | null>(null)
	const [revoking, setRevoking] = useState<string | null>(null)
	const [error, setError] = useState<string>()

	useEffect(() => {
		let cancelled = false
		user
			.getSessions()
			.then(list => !cancelled && setSessions(list.filter(item => item.status === 'active')))
			.catch(caught => !cancelled && setError(errorMessage(caught)))
		return () => {
			cancelled = true
		}
	}, [user])

	const revoke = async (session: SessionWithActivitiesResource) => {
		setError(undefined)
		setRevoking(session.id)
		try {
			await session.revoke()
			setSessions(list => list?.filter(item => item.id !== session.id) ?? null)
		} catch (caught) {
			setError(errorMessage(caught))
		} finally {
			setRevoking(null)
		}
	}

	// Joriy qurilma har doim birinchi
	const ordered = sessions
		? [...sessions].sort((a, b) => Number(b.id === current?.id) - Number(a.id === current?.id))
		: null

	return (
		<SettingsCard
			title='Faol sessiyalar'
			description='Tanimagan qurilmani ko‘rsangiz — undan chiqing va parolni yangilang.'
			hint={sessions && `${sessions.length} ta faol qurilma`}
		>
			{ordered ? (
				<ul className='divide-y border'>
					{ordered.map(session => {
						const activity = session.latestActivity
						const isCurrent = session.id === current?.id
						const Icon = activity?.isMobile ? Smartphone : Laptop
						const device = [activity?.browserName, activity?.deviceType].filter(Boolean).join(' · ')
						const place = [activity?.city, activity?.country].filter(Boolean).join(', ')

						return (
							<li key={session.id} className='flex flex-wrap items-center gap-3 px-4 py-3'>
								<span className='flex size-9 items-center justify-center rounded-full border bg-muted/40'>
									<Icon className='size-4' />
								</span>
								<div className='min-w-0 flex-1'>
									<p className='flex items-center gap-2 text-sm font-medium'>
										{device || "Noma'lum qurilma"}
										{isCurrent && (
											<span className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-emerald-700 uppercase dark:text-emerald-400'>
												Shu qurilma
											</span>
										)}
									</p>
									<p className='truncate text-xs text-muted-foreground'>
										{[place, activity?.ipAddress, formatRelative(session.lastActiveAt)]
											.filter(Boolean)
											.join(' · ')}
									</p>
								</div>
								{!isCurrent && (
									<Button
										variant='outline'
										size='sm'
										onClick={() => revoke(session)}
										disabled={revoking === session.id}
									>
										{revoking === session.id && <Loader2 className='animate-spin' />}
										Chiqish
									</Button>
								)}
							</li>
						)
					})}
				</ul>
			) : (
				!error && (
					<div className='space-y-2'>
						{[0, 1].map(index => (
							<div key={index} className='h-15 animate-pulse border bg-muted/40' />
						))}
					</div>
				)
			)}
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default SessionsCard
