'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import CartButton from '@/components/shared/cart-button'
import SearchCommand from '@/components/shared/search/search-command'
import UserMenu from '@/components/shared/user-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { findDashboardLink } from '../_lib/nav'
import { useNavShortcuts } from '../_lib/use-nav-shortcuts'

/** Yuqori panel: menyuni yig'ish, "non bo'laklari", qidiruv, savat va avatar */
const DashboardNavbar = () => {
	const pathname = usePathname()
	const current = findDashboardLink(pathname)
	const isRoot = current?.href === '/dashboard'
	useNavShortcuts()

	return (
		<header className='sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:px-4'>
			<SidebarTrigger className='-ml-1' />
			<Separator orientation='vertical' className='mx-1 h-5 data-vertical:self-center' />

			<nav aria-label='Joylashuv' className='flex min-w-0 items-center gap-1.5 text-sm'>
				<Link
					href='/dashboard'
					className={isRoot ? 'font-medium' : 'hidden text-muted-foreground transition-colors hover:text-foreground sm:inline'}
				>
					Dashboard
				</Link>
				{current && !isRoot && (
					<>
						<ChevronRight className='hidden size-3.5 text-muted-foreground/60 sm:block' />
						<span className='flex min-w-0 items-center gap-1.5 font-medium'>
							<current.icon className='size-3.5 shrink-0 text-muted-foreground' />
							<span className='truncate'>{current.label}</span>
						</span>
					</>
				)}
			</nav>

			<div className='ml-auto flex items-center gap-1.5'>
				<SearchCommand />
				<CartButton />
				<div className='ml-1'>
					<UserMenu />
				</div>
			</div>
		</header>
	)
}

export default DashboardNavbar
