'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import UserAvatar from '@/components/shared/user-avatar'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from '@/components/ui/sidebar'
import { adminNav, getAdminBadges, isActiveAdminLink } from '../_lib/nav'
import EnvironmentCard from './environment-card'
import ScopeSwitcher from './scope-switcher'

const badges = getAdminBadges()

/**
 * Admin yon menyusi — Vercel uslubida: tepada "scope" almashtirgich, guruhlangan bo'limlar,
 * hover'da klaviatura yorlig'i, pastda muhit kartasi va administrator.
 */
const AdminSidebar = () => {
	const pathname = usePathname()
	const { setOpenMobile } = useSidebar()

	return (
		<Sidebar collapsible='icon'>
			<SidebarHeader className='h-14 justify-center border-b'>
				<ScopeSwitcher />
			</SidebarHeader>

			<SidebarContent className='gap-0 py-2'>
				{adminNav.map(group => (
					<SidebarGroup key={group.label} className='py-1'>
						<SidebarGroupLabel className='font-mono text-[10px] tracking-widest uppercase'>
							{group.label}
						</SidebarGroupLabel>
						<SidebarMenu>
							{group.links.map(({ href, label, icon: Icon, badge, shortcut }) => {
								const active = isActiveAdminLink(pathname, href)
								const count = badge ? badges[badge] : 0

								return (
									<SidebarMenuItem key={href} className='group/link'>
										<SidebarMenuButton
											isActive={active}
											tooltip={`${label} · G ${shortcut}`}
											render={<Link href={href} onClick={() => setOpenMobile(false)} />}
											className='relative data-active:font-medium data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:-left-2 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-foreground group-data-[collapsible=icon]:data-active:before:hidden'
										>
											<Icon />
											<span>{label}</span>
										</SidebarMenuButton>
										{count > 0 ? (
											<SidebarMenuBadge className='font-mono text-[11px] tabular-nums transition-opacity group-hover/link:opacity-0'>
												{count}
											</SidebarMenuBadge>
										) : null}
										{/* Hover'da raqam o'rnida yorliq ko'rinadi: G + harf */}
										<kbd className='pointer-events-none absolute top-1/2 right-1.5 hidden -translate-y-1/2 items-center gap-0.5 font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover/link:opacity-100 md:flex group-data-[collapsible=icon]:hidden'>
											<span className='rounded border bg-background px-1'>G</span>
											<span className='rounded border bg-background px-1'>{shortcut}</span>
										</kbd>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroup>
				))}

				<EnvironmentCard />
			</SidebarContent>

			<SidebarFooter className='border-t'>
				<AdminUser />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}

const AdminUser = () => {
	const { user } = useUser()
	const { signOut } = useClerk()
	const [signingOut, setSigningOut] = useState(false)

	if (!user) {
		return (
			<div className='flex items-center gap-2 p-1'>
				<span className='size-8 shrink-0 animate-pulse rounded-full bg-muted' />
				<span className='h-3.5 w-24 animate-pulse rounded bg-muted group-data-[collapsible=icon]:hidden' />
			</div>
		)
	}

	return (
		<div className='flex items-center gap-2.5 rounded-md p-1 group-data-[collapsible=icon]:justify-center'>
			<Link href='/dashboard/profile' aria-label='Profil' className='relative shrink-0 rounded-full'>
				<UserAvatar user={user} />
				{/* Admin belgisi — avatar burchagida */}
				<span className='absolute -right-0.5 -bottom-0.5 size-3 rotate-45 rounded-[2px] border-2 border-sidebar bg-foreground' />
			</Link>
			<div className='min-w-0 flex-1 group-data-[collapsible=icon]:hidden'>
				<p className='truncate text-sm font-medium'>
					{user.fullName || (user.username ? `@${user.username}` : 'Administrator')}
				</p>
				<p className='truncate font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
					Administrator
				</p>
			</div>
			<button
				type='button'
				aria-label='Chiqish'
				title='Chiqish'
				disabled={signingOut}
				onClick={async () => {
					setSigningOut(true)
					await signOut({ redirectUrl: '/' })
				}}
				className='flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60 group-data-[collapsible=icon]:hidden [&_svg]:size-4'
			>
				{signingOut ? <Loader2 className='animate-spin' /> : <LogOut />}
			</button>
		</div>
	)
}

export default AdminSidebar
