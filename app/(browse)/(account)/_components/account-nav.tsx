'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { LogOut, Package, Settings, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import UserAvatar from '@/components/shared/user-avatar'
import { cn } from '@/lib/utils'

export const accountLinks = [
	{ href: '/profile', label: 'Profil', icon: UserRound },
	{ href: '/orders', label: 'Buyurtmalar', icon: Package },
	{ href: '/settings', label: 'Sozlamalar', icon: Settings },
]

/**
 * Akkaunt bo'limi navigatsiyasi: katta ekranda chapda yopishqoq panel,
 * mobil ekranda gorizontal tablar.
 */
const AccountNav = () => {
	const pathname = usePathname()
	const { user } = useUser()
	const { signOut } = useClerk()

	return (
		<aside className='lg:sticky lg:top-24 lg:self-start'>
			{/* Mini profil — faqat katta ekranda */}
			<div className='mb-6 hidden items-center gap-3 lg:flex'>
				{user ? (
					<>
						<UserAvatar user={user} />
						<div className='min-w-0'>
							<p className='truncate text-sm font-medium'>
								{user.fullName || (user.username && `@${user.username}`)}
							</p>
							<p className='truncate text-xs text-muted-foreground'>
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
					</>
				) : (
					<>
						<span className='size-8 animate-pulse rounded-full bg-muted' />
						<span className='h-4 w-28 animate-pulse rounded bg-muted' />
					</>
				)}
			</div>

			<nav
				aria-label='Akkaunt'
				className='-mx-4 flex gap-1 overflow-x-auto border-b px-4 lg:mx-0 lg:flex-col lg:gap-0.5 lg:border-0 lg:px-0'
			>
				{accountLinks.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(`${href}/`)

					return (
						<Link
							key={href}
							href={href}
							aria-current={active ? 'page' : undefined}
							className={cn(
								'relative flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:rounded-md lg:py-2 lg:hover:bg-muted/60 [&_svg]:size-4',
								active && 'text-foreground lg:bg-muted',
								// Mobil: pastki chiziq, desktop: chap chiziq
								active &&
									'after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-foreground lg:after:inset-x-auto lg:after:inset-y-2 lg:after:-left-px lg:after:bottom-auto lg:after:h-auto lg:after:w-0.5'
							)}
						>
							<Icon />
							{label}
						</Link>
					)
				})}
			</nav>

			<div className='mt-6 hidden border-t pt-4 lg:block'>
				<button
					type='button'
					onClick={() => signOut({ redirectUrl: '/' })}
					className='flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive [&_svg]:size-4'
				>
					<LogOut />
					Chiqish
				</button>
			</div>
		</aside>
	)
}

export default AccountNav
