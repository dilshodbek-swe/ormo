import {
	BarChart3,
	Boxes,
	CreditCard,
	Flame,
	FolderTree,
	LayoutDashboard,
	Mail,
	MessageSquareText,
	Package,
	Settings,
	ShoppingBag,
	Star,
	TicketPercent,
	UsersRound,
	type LucideIcon,
} from 'lucide-react'

import { bundles } from '@/lib/data/bundles'
import { catalogProducts } from '@/lib/data/catalog'
import { categories } from '@/lib/data/categories'
import { adminOrders } from '../orders/_lib/sample-orders'
import { PROMO_CODES } from '@/lib/store/cart/cart-pricing'

export type AdminBadge = 'activeOrders' | 'products' | 'categories' | 'coupons' | 'bundles'

export interface AdminLink {
	href: string
	label: string
	icon: LucideIcon
	/** Klaviatura yorlig'i: `G` keyin shu harf */
	shortcut: string
	/** Bo'lim nima uchun — sarlavha ostida va buyruqlar palitrasida */
	description: string
	/** Bo'lim qurilguncha ko'rsatiladigan reja */
	planned: string[]
	badge?: AdminBadge
}

export interface AdminNavGroup {
	label: string
	links: AdminLink[]
}

export const adminNav: AdminNavGroup[] = [
	{
		label: 'Umumiy',
		links: [
			{
				href: '/admin',
				label: 'Boshqaruv',
				icon: LayoutDashboard,
				shortcut: 'D',
				description: "Do'konning umumiy holati: sotuvlar, buyurtmalar va tezkor havolalar.",
				planned: [],
			},
			{
				href: '/admin/analytics',
				label: 'Analitika',
				icon: BarChart3,
				shortcut: 'A',
				description: 'Daromad, konversiya va eng yaxshi sotilayotgan mahsulotlar dinamikasi.',
				planned: ['Kunlik/oylik daromad grafigi', 'Konversiya voronkasi', 'Top mahsulotlar va kategoriyalar'],
			},
		],
	},
	{
		label: 'Savdo',
		links: [
			{
				href: '/admin/orders',
				label: 'Buyurtmalar',
				icon: Package,
				shortcut: 'O',
				badge: 'activeOrders',
				description: "Barcha buyurtmalar, ularning holati va yetkazib berish bosqichlari.",
				planned: [],
			},
			{
				href: '/admin/payments',
				label: "To'lovlar",
				icon: CreditCard,
				shortcut: 'T',
				description: "Click, Payme va karta orqali tushgan to'lovlar hamda qaytarishlar.",
				planned: ["Tranzaksiyalar jurnali", "Qaytarish (refund) so'rovlari", "To'lov usullari bo'yicha hisobot"],
			},
			{
				href: '/admin/coupons',
				label: 'Kuponlar',
				icon: TicketPercent,
				shortcut: 'K',
				badge: 'coupons',
				description: "Savatdagi promo-kodlar: chegirma foizi, muddati va ishlatilish soni.",
				planned: ['Kupon yaratish va tahrirlash', 'Amal qilish muddati va limit', "Ishlatilish statistikasi"],
			},
		],
	},
	{
		label: 'Katalog',
		links: [
			{
				href: '/admin/products',
				label: 'Mahsulotlar',
				icon: ShoppingBag,
				shortcut: 'P',
				badge: 'products',
				description: "Mahsulotlar ro'yxati, narxlar, rasmlar va ombordagi qoldiq.",
				planned: [],
			},
			{
				href: '/admin/categories',
				label: 'Kategoriyalar',
				icon: FolderTree,
				shortcut: 'C',
				badge: 'categories',
				description: "Katalog tuzilmasi — kategoriyalar, ularning rasmi va tavsifi.",
				planned: ["Kategoriya qo'shish/tahrirlash", 'Tartibni sudrab almashtirish', "Har bir kategoriyadagi mahsulotlar soni"],
			},
			{
				href: '/admin/deals',
				label: 'Aksiyalar',
				icon: Flame,
				shortcut: 'E',
				description: "Hafta aksiyalari va bosh sahifadagi \"kun taklifi\".",
				planned: ['Hafta kunlari bo‘yicha aksiya jadvali', 'Kun taklifi va taymer', 'Chegirma foizini boshqarish'],
			},
			{
				href: '/admin/bundles',
				label: "To'plamlar",
				icon: Boxes,
				shortcut: 'B',
				badge: 'bundles',
				description: "Birga arzonroq sotiladigan mahsulot to'plamlari.",
				planned: ["To'plam tarkibini tanlash", "Qo'shimcha chegirma foizi", 'Tavsif va tartib'],
			},
			{
				href: '/admin/reviews',
				label: 'Sharhlar',
				icon: Star,
				shortcut: 'R',
				description: 'Mijozlar qoldirgan baholar va sharhlarni moderatsiya qilish.',
				planned: ['Yangi sharhlar navbati', 'Tasdiqlash / yashirish', 'Sharhga javob yozish'],
			},
		],
	},
	{
		label: 'Mijozlar',
		links: [
			{
				href: '/admin/users',
				label: 'Foydalanuvchilar',
				icon: UsersRound,
				shortcut: 'U',
				description: "Ro'yxatdan o'tgan mijozlar, ularning rollari va buyurtmalari.",
				planned: ['Qidiruv va rol bo‘yicha filtr', 'Admin rolini berish/olish', 'Mijoz buyurtmalari va manzillari'],
			},
			{
				href: '/admin/messages',
				label: 'Xabarlar',
				icon: MessageSquareText,
				shortcut: 'X',
				description: "Aloqa sahifasidagi forma orqali yuborilgan murojaatlar.",
				planned: ["Kiruvchi murojaatlar ro'yxati", "O'qilgan/javob berilgan holatlari", 'Email orqali javob'],
			},
			{
				href: '/admin/subscribers',
				label: 'Obunachilar',
				icon: Mail,
				shortcut: 'N',
				description: "Yangiliklar (newsletter) ga obuna bo'lganlar.",
				planned: ["Obunachilar ro'yxati va eksport (CSV)", 'Obunani bekor qilish', 'Kampaniya yuborish'],
			},
		],
	},
	{
		label: 'Tizim',
		links: [
			{
				href: '/admin/settings',
				label: 'Sozlamalar',
				icon: Settings,
				shortcut: 'S',
				description: "Do'kon ma'lumotlari, yetkazib berish narxlari va integratsiyalar.",
				planned: ["Do'kon nomi, aloqa va ish vaqti", 'Bepul yetkazish chegarasi', 'Clerk, MongoDB va Google Maps holati'],
			},
		],
	},
]

export const adminLinks = adminNav.flatMap(group => group.links)

/** Joriy yo'lga mos bo'lim (eng uzun mos keluvchi) */
export const findAdminLink = (pathname: string) =>
	adminLinks
		.filter(link => pathname === link.href || pathname.startsWith(`${link.href}/`))
		.sort((a, b) => b.href.length - a.href.length)[0]

export const isActiveAdminLink = (pathname: string, href: string) => findAdminLink(pathname)?.href === href

export const getAdminLink = (href: string) => {
	const link = adminLinks.find(item => item.href === href)
	if (!link) throw new Error(`Admin bo'limi topilmadi: ${href}`)
	return link
}

export const getAdminGroup = (href: string) => adminNav.find(group => group.links.some(link => link.href === href))

/** Sidebar'dagi raqamlar. Hozircha namunaviy ma'lumotlardan — API ulanganda serverdan keladi. */
export const getAdminBadges = (): Record<AdminBadge, number> => ({
	activeOrders: adminOrders.filter(order => order.status === 'processing').length,
	products: catalogProducts.length,
	categories: categories.length,
	coupons: Object.keys(PROMO_CODES).length,
	bundles: bundles.length,
})
