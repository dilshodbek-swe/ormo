'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import UserMenu from '@/components/shared/user-menu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useNavShortcuts } from '@/lib/hooks/use-nav-shortcuts'
import { adminLinks, findAdminLink } from '../_lib/nav'
import AdminCommand from './admin-command'

const Slash = () => (
	<svg viewBox='0 0 24 24' aria-hidden className='size-4 shrink-0 text-muted-foreground/40'>
		<path d='M16.88 3.549L7.12 20.451' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
	</svg>
)

/** Yuqori panel: menyuni yig'ish, Vercel uslubidagi "/" yo'l, bo'limlar palitrasi, saytga havola va avatar */
const AdminNavbar = () => {
	const pathname = usePathname()
	const current = findAdminLink(pathname)
	const isRoot = current?.href === '/admin'
	useNavShortcuts(adminLinks)

	return (
		<header className='sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-4'>
			<SidebarTrigger className='-ml-1' />
			<Separator orientation='vertical' className='mx-1 h-5 data-vertical:self-center' />

			<nav aria-label='Joylashuv' className='flex min-w-0 items-center gap-1 text-sm'>
				<Link
					href='/admin'
					className={isRoot ? 'font-medium' : 'hidden text-muted-foreground transition-colors hover:text-foreground sm:inline'}
				>
					Admin
				</Link>
				{current && !isRoot && (
					<>
						<span className='hidden sm:block'>
							<Slash />
						</span>
						<span className='flex min-w-0 items-center gap-1.5 font-medium'>
							<current.icon className='size-3.5 shrink-0 text-muted-foreground' />
							<span className='truncate'>{current.label}</span>
						</span>
					</>
				)}
			</nav>

			<div className='ml-auto flex items-center gap-1.5'>
				<AdminCommand />
				<Button
					variant='ghost'
					size='icon'
					aria-label='Saytni yangi oynada ochish'
					title='Saytni ochish'
					nativeButton={false}
					render={<Link href='/' target='_blank' />}
				>
					<ExternalLink />
				</Button>
				<div className='ml-1'>
					<UserMenu />
				</div>
			</div>
		</header>
	)
}

export default AdminNavbar
