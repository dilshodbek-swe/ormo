'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { Loader2, LogOut, Package, Settings, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import UserAvatar from './user-avatar'

const menuLinks = [
	{ href: '/profile', label: 'Profil', icon: UserRound },
	{ href: '/orders', label: 'Buyurtmalar', icon: Package },
	{ href: '/settings', label: 'Sozlamalar', icon: Settings },
]

const itemClass =
	'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground [&_svg]:size-4'

/** Headerdagi avatar: bosilganda profil ma'lumotlari va akkaunt menyusi ochiladi */
const UserMenu = () => {
	const { user } = useUser()
	const { signOut } = useClerk()
	const [open, setOpen] = useState(false)
	const [signingOut, setSigningOut] = useState(false)

	if (!user) return null

	const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')
	const email = user.primaryEmailAddress?.emailAddress
	const title = fullName || (user.username ? `@${user.username}` : email)
	// Sarlavhada ism bo'lsa, ostida username (yo'q bo'lsa email); aks holda email
	const subtitle = fullName ? (user.username ? `@${user.username}` : email) : email

	const handleSignOut = async () => {
		setSigningOut(true)
		await signOut({ redirectUrl: '/' })
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label='Akkaunt menyusi'
				className='rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50'
			>
				<UserAvatar user={user} />
			</PopoverTrigger>

			<PopoverContent align='end' sideOffset={8} className='w-64 gap-0 p-0'>
				{/* Profil kartasi */}
				<div className='flex items-center gap-3 p-3'>
					<UserAvatar user={user} size='lg' />
					<div className='min-w-0'>
						<p className='truncate font-medium text-foreground'>{title}</p>
						{subtitle && subtitle !== title && (
							<p className='truncate text-xs text-muted-foreground'>{subtitle}</p>
						)}
					</div>
				</div>

				<Separator />

				<nav className='p-1.5'>
					{menuLinks.map(({ href, label, icon: Icon }) => (
						<Link key={href} href={href} onClick={() => setOpen(false)} className={itemClass}>
							<Icon />
							{label}
						</Link>
					))}
				</nav>

				<Separator />

				<div className='p-1.5'>
					<button
						type='button'
						onClick={handleSignOut}
						disabled={signingOut}
						className={`${itemClass} hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive disabled:opacity-60`}
					>
						{signingOut ? <Loader2 className='animate-spin' /> : <LogOut />}
						Chiqish
					</button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default UserMenu
