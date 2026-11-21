'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { useStore } from '@/lib/store'
import { selectWishlistCount } from '@/lib/store/wishlist/wishlist-selectors'
import { cn } from '@/lib/utils'

/** Doiraviy progress: to'lgan qismi `value` (0–1) */
const Ring = ({ value }: { value: number }) => {
	const radius = 22
	const length = 2 * Math.PI * radius

	return (
		<svg viewBox='0 0 56 56' className='size-14 -rotate-90'>
			<circle cx='28' cy='28' r={radius} fill='none' className='stroke-border' strokeWidth='5' />
			<circle
				cx='28'
				cy='28'
				r={radius}
				fill='none'
				strokeWidth='5'
				strokeLinecap='round'
				className='stroke-foreground transition-[stroke-dashoffset] duration-1000 ease-out'
				strokeDasharray={length}
				strokeDashoffset={length * (1 - value)}
			/>
		</svg>
	)
}

/** "Akkauntni to'ldiring" — bajarilmagan qadamlar sozlash joyiga olib boradi */
const AccountChecklist = ({ user }: { user: UserResource }) => {
	const wishlistCount = useStore(selectWishlistCount)

	const steps = [
		{ label: 'Profil rasmini yuklang', done: user.hasImage, href: '/dashboard/profile' },
		{ label: 'Ism va familiyani kiriting', done: Boolean(user.firstName && user.lastName), href: '/dashboard/profile' },
		{
			label: 'Emailni tasdiqlang',
			done: user.primaryEmailAddress?.verification.status === 'verified',
			href: '/dashboard/profile',
		},
		{ label: 'Parol o‘rnating', done: user.passwordEnabled, href: '/dashboard/settings#security' },
		{ label: 'Sevimlilarga mahsulot qo‘shing', done: wishlistCount > 0, href: '/shop' },
	]

	const done = steps.filter(step => step.done).length
	const complete = done === steps.length

	return (
		<section className='flex h-full flex-col border bg-background'>
			<div className='flex items-center gap-4 border-b p-5'>
				<div className='relative'>
					<Ring value={done / steps.length} />
					<span className='absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums'>
						{Math.round((done / steps.length) * 100)}%
					</span>
				</div>
				<div>
					<h2 className='font-space-grotesk text-lg font-bold tracking-tight'>
						{complete ? 'Akkaunt tayyor' : 'Akkauntni to‘ldiring'}
					</h2>
					<p className='text-sm text-muted-foreground'>
						{complete ? 'Hammasi joyida. Rahmat!' : `${steps.length - done} ta qadam qoldi`}
					</p>
				</div>
			</div>

			<ul className='flex-1 divide-y'>
				{steps.map(step => (
					<li key={step.label}>
						<Link
							href={step.href}
							className={cn(
								'group flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted/40',
								step.done && 'text-muted-foreground'
							)}
						>
							<span
								className={cn(
									'flex size-5 shrink-0 items-center justify-center rounded-full border',
									step.done && 'border-foreground bg-foreground text-background'
								)}
							>
								{step.done && <Check className='size-3' />}
							</span>
							<span className={cn('flex-1', step.done && 'line-through decoration-muted-foreground/40')}>
								{step.label}
							</span>
							{!step.done && (
								<ChevronRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
							)}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}

export default AccountChecklist
