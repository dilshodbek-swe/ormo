'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { ArrowUpRight, Loader2, LogOut, Truck } from 'lucide-react'
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
import { getOrderStats } from '@/lib/data/orders'
import { useStore } from '@/lib/store'
import { FREE_SHIPPING_FROM } from '@/lib/store/cart/cart-pricing'
import { selectCartSubtotal } from '@/lib/store/cart/cart-selectors'
import useStoreHydrated from '@/lib/store/use-store-hydrated'
import { selectWishlistCount } from '@/lib/store/wishlist/wishlist-selectors'
import { formatPrice } from '@/lib/utils'
import { type DashboardBadge, dashboardNav, isActiveLink } from '../_lib/nav'

/** Yon menyu — Vercel uslubida: guruhlar, tooltipli "ikonka" rejimi, pastda foydalanuvchi */
const DashboardSidebar = () => {
	const pathname = usePathname()
	const { setOpenMobile } = useSidebar()
	const hydrated = useStoreHydrated()
	const wishlistCount = useStore(selectWishlistCount)
	const activeOrders = getOrderStats().active

	const badges: Record<DashboardBadge, number> = {
		activeOrders,
		wishlist: hydrated ? wishlistCount : 0,
	}

	return (
		<Sidebar collapsible='icon'>
			<SidebarHeader className='h-14 justify-center border-b'>
				<Link
					href='/'
					className='flex items-center gap-2.5 px-2 font-space-grotesk text-lg font-bold tracking-tight group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center'
				>
					<span className='size-3.5 shrink-0 rotate-45 rounded-[3px] bg-foreground' />
					<span className='group-data-[collapsible=icon]:hidden'>Ormo</span>
					<span className='rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase group-data-[collapsible=icon]:hidden'>
						Dashboard
					</span>
				</Link>
			</SidebarHeader>

			<SidebarContent className='gap-0 py-2'>
				{dashboardNav.map(group => (
					<SidebarGroup key={group.label} className='py-1'>
						<SidebarGroupLabel className='font-mono text-[10px] tracking-widest uppercase'>
							{group.label}
						</SidebarGroupLabel>
						<SidebarMenu>
							{group.links.map(({ href, label, icon: Icon, badge }) => {
								const active = isActiveLink(pathname, href)
								const count = badge ? badges[badge] : 0

								return (
									<SidebarMenuItem key={href}>
										<SidebarMenuButton
											isActive={active}
											tooltip={label}
											render={<Link href={href} onClick={() => setOpenMobile(false)} />}
											className='relative data-active:font-medium data-active:before:absolute data-active:before:inset-y-1.5 data-active:before:-left-2 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-foreground group-data-[collapsible=icon]:data-active:before:hidden'
										>
											<Icon />
											<span>{label}</span>
										</SidebarMenuButton>
										{count > 0 && (
											<SidebarMenuBadge className='font-mono text-[11px] tabular-nums'>
												{count}
											</SidebarMenuBadge>
										)}
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroup>
				))}

				<ShippingCard />
			</SidebarContent>

			<SidebarFooter className='border-t'>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Do'konga qaytish" render={<Link href='/shop' />}>
							<ArrowUpRight />
							<span>Do&apos;konga qaytish</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<UserBlock />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	)
}

/** Savat bo'yicha bepul yetkazish hisoblagichi — kichik "jonli" karta */
const ShippingCard = () => {
	const hydrated = useStoreHydrated()
	const subtotal = useStore(selectCartSubtotal)
	if (!hydrated) return null

	const untilFree = Math.max(FREE_SHIPPING_FROM - subtotal, 0)
	const progress = Math.min((subtotal / FREE_SHIPPING_FROM) * 100, 100)

	return (
		<div className='mx-3 mt-auto mb-2 space-y-3 rounded-lg border bg-background p-3 group-data-[collapsible=icon]:hidden'>
			<div className='flex items-center gap-2'>
				<span className='flex size-7 items-center justify-center rounded-md border'>
					<Truck className='size-3.5' />
				</span>
				<p className='text-xs leading-tight'>
					{untilFree === 0 ? (
						<span className='font-medium text-emerald-700 dark:text-emerald-400'>Yetkazish bepul!</span>
					) : (
						<>
							<span className='text-muted-foreground'>Bepul yetkazishgacha</span>
							<br />
							<span className='font-mono font-semibold'>{formatPrice(untilFree)}</span>
						</>
					)}
				</p>
			</div>
			<div className='h-1 overflow-hidden rounded-full bg-border'>
				<div
					className='h-full rounded-full bg-linear-to-r from-amber-300 via-orange-500 to-rose-500 transition-[width] duration-700'
					style={{ width: `${progress}%` }}
				/>
			</div>
			<Link
				href='/cart'
				className='block text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
			>
				Savatni ochish →
			</Link>
		</div>
	)
}

const UserBlock = () => {
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
			<Link href='/dashboard/profile' aria-label='Profil' className='shrink-0 rounded-full'>
				<UserAvatar user={user} />
			</Link>
			<div className='min-w-0 flex-1 group-data-[collapsible=icon]:hidden'>
				<p className='truncate text-sm font-medium'>
					{user.fullName || (user.username ? `@${user.username}` : 'Ormo mijozi')}
				</p>
				<p className='truncate text-xs text-muted-foreground'>{user.primaryEmailAddress?.emailAddress}</p>
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

export default DashboardSidebar
