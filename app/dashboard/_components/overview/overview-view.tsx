'use client'

import { useUser } from '@clerk/nextjs'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'
import { getOrderStats, getOrderTotal, orders } from '@/lib/data/orders'
import { useStore } from '@/lib/store'
import useStoreHydrated from '@/lib/store/use-store-hydrated'
import { selectWishlistCount } from '@/lib/store/wishlist/wishlist-selectors'
import { formatDate, formatPrice } from '@/lib/utils'
import { dashboardLinks } from '../../_lib/nav'
import PageHeader from '../page-header'
import StatusBadge from '../status-badge'
import AccountChecklist from './account-checklist'
import ActiveOrder from './active-order'

const sortedOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
const activeOrder = sortedOrders.find(order => order.status === 'shipped' || order.status === 'processing')

const quickLinks: { href: string; description: string }[] = [
	{ href: '/dashboard/orders', description: 'Kuzatish, chek va qayta buyurtma' },
	{ href: '/dashboard/payments', description: 'Kartalar va to‘lovlar tarixi' },
	{ href: '/dashboard/addresses', description: 'Yetkazish manzillari daftari' },
	{ href: '/dashboard/wishlist', description: 'Saqlab qo‘yilgan mahsulotlar' },
]

const Stat = ({ label, value, hint, href }: { label: string; value: string; hint?: string; href: string }) => (
	<Link href={href} className='group block p-4 transition-colors hover:bg-muted/40 sm:p-5'>
		<p className='flex items-center justify-between font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>
			{label}
			<ArrowUpRight className='size-3.5 opacity-0 transition-opacity group-hover:opacity-100' />
		</p>
		<p className='mt-1.5 truncate font-space-grotesk text-2xl font-bold tracking-tight tabular-nums sm:text-3xl'>
			{value}
		</p>
		{hint && <p className='mt-0.5 truncate text-xs text-muted-foreground'>{hint}</p>}
	</Link>
)

const Kbd = ({ children }: { children: string }) => (
	<kbd className='inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground'>
		{children}
	</kbd>
)

const OverviewView = () => {
	const { user } = useUser()
	const hydrated = useStoreHydrated()
	const wishlistCount = useStore(selectWishlistCount)
	const stats = getOrderStats()

	return (
		<>
			<PageHeader
				eyebrow='Dashboard · Umumiy ko‘rinish'
				title={
					<>
						{user?.firstName ? `Salom, ${user.firstName}.` : 'Salom.'}{' '}
						<span className='text-muted-foreground'>Mana sizning Ormo&apos;ngiz.</span>
					</>
				}
				description='Buyurtmalar, to‘lovlar va akkaunt holati — hammasi bir qarashda.'
				action={
					<Button nativeButton={false} render={<Link href='/shop' />}>
						Xaridni davom ettirish
						<ArrowRight />
					</Button>
				}
			/>

			<div className='space-y-6'>
				<GridFrame className='grid grid-cols-2 divide-x divide-y bg-background lg:grid-cols-4 lg:divide-y-0'>
					<Stat
						label='Faol buyurtmalar'
						value={String(stats.active)}
						hint={`Jami ${stats.count} ta buyurtma`}
						href='/dashboard/orders'
					/>
					<Stat label='Jami xaridlar' value={formatPrice(stats.spent)} hint='Bekor qilinganlarsiz' href='/dashboard/payments' />
					<Stat label='Tejaldi' value={formatPrice(stats.saved)} hint='Chegirmalar hisobiga' href='/deals' />
					<Stat
						label='Sevimlilar'
						value={hydrated ? String(wishlistCount) : '—'}
						hint='Shu qurilmada'
						href='/dashboard/wishlist'
					/>
				</GridFrame>

				<div className='grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
					<ActiveOrder order={activeOrder} />
					{user ? <AccountChecklist user={user} /> : <div className='min-h-80 animate-pulse border bg-muted/30' />}
				</div>

				<div className='grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
					{/* So'nggi buyurtmalar */}
					<section className='border bg-background'>
						<header className='flex items-center justify-between border-b px-5 py-3'>
							<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>So&apos;nggi buyurtmalar</h2>
							<Link href='/dashboard/orders' className='text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
								Hammasi
							</Link>
						</header>
						<ul className='divide-y'>
							{sortedOrders.slice(0, 4).map(order => (
								<li key={order.id}>
									<Link href='/dashboard/orders' className='flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/30'>
										<span className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white'>
											<Image src={order.items[0].product.image} alt='' width={64} height={64} className='size-8 object-contain' />
										</span>
										<div className='min-w-0 flex-1'>
											<p className='text-sm font-medium'>{order.id}</p>
											<p className='font-mono text-[11px] text-muted-foreground'>{formatDate(order.createdAt)}</p>
										</div>
										<span className='hidden sm:block'>
											<StatusBadge status={order.status} />
										</span>
										<span className='w-32 text-right font-mono text-sm tabular-nums'>{formatPrice(getOrderTotal(order))}</span>
									</Link>
								</li>
							))}
						</ul>
					</section>

					{/* Tezkor o'tish — klaviatura yorliqlari bilan */}
					<section className='border bg-background'>
						<header className='flex items-center justify-between border-b px-5 py-3'>
							<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>Tezkor o&apos;tish</h2>
							<span className='hidden items-center gap-1 text-xs text-muted-foreground sm:flex'>
								<Kbd>G</Kbd> keyin harf
							</span>
						</header>
						<ul className='divide-y'>
							{quickLinks.map(({ href, description }) => {
								const link = dashboardLinks.find(item => item.href === href)!
								return (
									<li key={href}>
										<Link href={href} className='group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30'>
											<span className='flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors group-hover:border-foreground/40'>
												<link.icon className='size-4' />
											</span>
											<div className='min-w-0 flex-1'>
												<p className='text-sm font-medium'>{link.label}</p>
												<p className='truncate text-xs text-muted-foreground'>{description}</p>
											</div>
											<span className='hidden gap-1 sm:flex'>
												<Kbd>G</Kbd>
												<Kbd>{link.shortcut}</Kbd>
											</span>
										</Link>
									</li>
								)
							})}
						</ul>
					</section>
				</div>
			</div>
		</>
	)
}

export default OverviewView
