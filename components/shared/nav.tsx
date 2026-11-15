'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { navLinks } from './nav-links'

const Nav = ({ className }: { className?: string }) => {
	const pathname = usePathname()

	return (
		<nav className={cn('flex items-center gap-1', className)}>
			{navLinks.map(({ href, label }) => {
				const isActive = pathname === href || pathname.startsWith(`${href}/`)

				return (
					<Link
						key={href}
						href={href}
						aria-current={isActive ? 'page' : undefined}
						className={cn(
							'shrink-0 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
							isActive && 'text-foreground'
						)}
					>
						{label}
					</Link>
				)
			})}
		</nav>
	)
}

export default Nav
