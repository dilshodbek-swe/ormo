import { ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import PageHeader from '@/components/shared/page-header'
import { adminNav, getAdminBadges } from './_lib/nav'

export const metadata: Metadata = { title: 'Boshqaruv' }

const badges = getAdminBadges()

/** Vaqtinchalik bosh sahifa: barcha bo'limlarga "launchpad". Statistika vidjetlari keyingi bosqichda. */
const AdminOverviewPage = () => {
	const sections = adminNav
		.map(group => ({ ...group, links: group.links.filter(link => link.href !== '/admin') }))
		.filter(group => group.links.length > 0)

	return (
		<>
			<PageHeader
				eyebrow='Admin · Umumiy'
				title={
					<>
						Boshqaruv <span className='text-muted-foreground'>paneli</span>
					</>
				}
				description="Ormo do'konining barcha bo'limlari bir joyda. Istalgan bo'limga Ctrl K yoki G + harf bilan o'ting."
			/>

			<div className='space-y-10'>
				{sections.map(group => (
					<section key={group.label} className='space-y-3'>
						<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>{group.label}</h2>
						{/* Vercel uslubi: kartalar orasida 1px chiziq (gap-px + bg-border) */}
						<div className='grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3'>
							{group.links.map(({ href, label, description, icon: Icon, shortcut, badge }) => (
								<Link
									key={href}
									href={href}
									className='group relative flex flex-col gap-4 bg-background p-5 transition-colors hover:bg-muted/40'
								>
									<div className='flex items-center justify-between'>
										<span className='flex size-9 items-center justify-center rounded-lg border bg-background transition-transform duration-300 group-hover:-rotate-6 [&_svg]:size-4'>
											<Icon />
										</span>
										<ArrowUpRight className='size-4 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all group-hover:translate-0 group-hover:opacity-100' />
									</div>
									<div className='space-y-1'>
										<p className='flex items-baseline gap-2 font-medium'>
											{label}
											{badge && (
												<span className='font-mono text-xs text-muted-foreground tabular-nums'>{badges[badge]}</span>
											)}
										</p>
										<p className='text-sm text-muted-foreground'>{description}</p>
									</div>
									<kbd className='mt-auto font-mono text-[10px] text-muted-foreground/70'>G {shortcut}</kbd>
								</Link>
							))}
							<GridFillers count={group.links.length} />
						</div>
					</section>
				))}
			</div>
		</>
	)
}

/**
 * Oxirgi qator to'lmasa, `bg-border` kulrang bo'shliq bo'lib ko'rinadi — uni chiziqli "bo'sh katak"lar
 * bilan to'ldiramiz: sm da 2 ustun, lg da 3 ustun bo'yicha alohida hisoblanadi.
 */
const GridFillers = ({ count }: { count: number }) => {
	const forSm = (2 - (count % 2)) % 2
	const forLg = (3 - (count % 3)) % 3

	return Array.from({ length: Math.max(forSm, forLg) }, (_, index) => (
		<div
			key={index}
			aria-hidden
			className={`hidden bg-background bg-[repeating-linear-gradient(-45deg,var(--color-border)_0_1px,transparent_1px_10px)] ${index < forSm ? 'sm:block' : 'sm:hidden'} ${index < forLg ? 'lg:block' : 'lg:hidden'}`}
		/>
	))
}

export default AdminOverviewPage
