import {
	CreditCard,
	Heart,
	LayoutGrid,
	MapPin,
	Package,
	Settings,
	UserRound,
	type LucideIcon,
} from 'lucide-react'

export type DashboardBadge = 'activeOrders' | 'wishlist'

export interface DashboardLink {
	href: string
	label: string
	icon: LucideIcon
	/** Klaviatura yorlig'i: `G` keyin shu harf */
	shortcut: string
	badge?: DashboardBadge
}

export const dashboardNav: { label: string; links: DashboardLink[] }[] = [
	{
		label: 'Umumiy',
		links: [{ href: '/dashboard', label: 'Bosh sahifa', icon: LayoutGrid, shortcut: 'D' }],
	},
	{
		label: 'Xaridlar',
		links: [
			{ href: '/dashboard/orders', label: 'Buyurtmalar', icon: Package, shortcut: 'O', badge: 'activeOrders' },
			{ href: '/dashboard/payments', label: "To'lovlar", icon: CreditCard, shortcut: 'P' },
			{ href: '/dashboard/addresses', label: 'Manzillar', icon: MapPin, shortcut: 'A' },
			{ href: '/dashboard/wishlist', label: 'Sevimlilar', icon: Heart, shortcut: 'W', badge: 'wishlist' },
		],
	},
	{
		label: 'Akkaunt',
		links: [
			{ href: '/dashboard/profile', label: 'Profil', icon: UserRound, shortcut: 'U' },
			{ href: '/dashboard/settings', label: 'Sozlamalar', icon: Settings, shortcut: 'S' },
		],
	},
]

export const dashboardLinks = dashboardNav.flatMap(group => group.links)

/** Joriy yo'lga mos bo'lim (eng uzun mos keluvchi) */
export const findDashboardLink = (pathname: string) =>
	dashboardLinks
		.filter(link => pathname === link.href || pathname.startsWith(`${link.href}/`))
		.sort((a, b) => b.href.length - a.href.length)[0]

export const isActiveLink = (pathname: string, href: string) => findDashboardLink(pathname)?.href === href
