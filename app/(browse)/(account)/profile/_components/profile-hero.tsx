'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { BadgeCheck, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import GridFrame from '@/components/shared/grid-frame'
import { getOrderStats } from '@/lib/data/orders'
import { useStore } from '@/lib/store'
import { selectCartCount } from '@/lib/store/cart/cart-selectors'
import useStoreHydrated from '@/lib/store/use-store-hydrated'
import { formatDate, formatPrice } from '@/lib/utils'
import AvatarUploader from './avatar-uploader'

const Stat = ({ label, value, href }: { label: string; value: string; href?: string }) => {
	const body = (
		<>
			<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>{label}</p>
			<p className='mt-1.5 truncate font-space-grotesk text-xl font-bold tracking-tight tabular-nums sm:text-2xl'>
				{value}
			</p>
		</>
	)

	return href ? (
		<Link href={href} className='block p-4 transition-colors hover:bg-muted/50 sm:p-5'>
			{body}
		</Link>
	) : (
		<div className='p-4 sm:p-5'>{body}</div>
	)
}

/** "A'zolik kartasi": avatar, ism, username va asosiy raqamlar */
const ProfileHero = ({ user }: { user: UserResource }) => {
	const [error, setError] = useState<string>()
	const hydrated = useStoreHydrated()
	const cartCount = useStore(selectCartCount)
	const stats = getOrderStats()

	const name = user.fullName || (user.username ? `@${user.username}` : 'Ormo mijozi')
	const verified = user.primaryEmailAddress?.verification.status === 'verified'

	return (
		<GridFrame as='section' className='bg-background'>
			{/* Yuqori nuqtali "banner" */}
			<div className='relative h-28 overflow-hidden border-b bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] sm:h-36'>
				<div className='absolute inset-0 bg-linear-to-b from-transparent to-background/80' />
				<p className='absolute top-4 right-5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
					Ormo ID · {user.id.slice(-6).toUpperCase()}
				</p>
			</div>

			<div className='flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:px-8'>
				<div className='-mt-14 sm:-mt-16'>
					<AvatarUploader user={user} onError={setError} />
				</div>

				<div className='min-w-0 flex-1 space-y-2 sm:pb-1'>
					<div className='flex flex-wrap items-center gap-2'>
						<h2 className='truncate font-space-grotesk text-3xl font-bold tracking-tighter'>{name}</h2>
						{verified && (
							<BadgeCheck className='size-5 shrink-0 text-sky-500' aria-label='Tasdiqlangan' />
						)}
					</div>
					<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground'>
						{user.fullName && user.username && <span>@{user.username}</span>}
						{user.primaryEmailAddress && <span>{user.primaryEmailAddress.emailAddress}</span>}
						{user.createdAt && (
							<span className='inline-flex items-center gap-1.5'>
								<CalendarDays className='size-3.5' />
								{formatDate(user.createdAt)} dan beri a&apos;zo
							</span>
						)}
					</div>
				</div>
			</div>

			{error && (
				<div className='px-5 pb-5 sm:px-8'>
					<FormAlert message={error} />
				</div>
			)}

			<div className='grid grid-cols-2 divide-x divide-y border-t md:grid-cols-4 md:divide-y-0'>
				<Stat label='Buyurtmalar' value={String(stats.count)} href='/orders' />
				<Stat label='Jami xaridlar' value={formatPrice(stats.spent)} />
				<Stat label='Tejaldi' value={formatPrice(stats.saved)} />
				<Stat label='Savatda' value={hydrated ? `${cartCount} dona` : '—'} href='/cart' />
			</div>
		</GridFrame>
	)
}

export default ProfileHero
