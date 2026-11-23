'use client'

import { useUser } from '@clerk/nextjs'
import { ArrowDownLeft, ArrowUpRight, Clock, CreditCard, Plus, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
	getPaymentStats,
	savedCards,
	type TransactionStatus,
	TRANSACTION_LABELS,
	transactions,
} from '@/lib/data/payments'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import PageHeader from '@/components/shared/page-header'
import PaymentCard from './payment-card'

const filters: { value: TransactionStatus | 'all'; label: string }[] = [
	{ value: 'all', label: 'Barchasi' },
	{ value: 'paid', label: "To'langan" },
	{ value: 'refunded', label: 'Qaytarilgan' },
	{ value: 'pending', label: 'Kutilmoqda' },
]

const statusStyles: Record<TransactionStatus, { icon: typeof ArrowUpRight; tone: string }> = {
	paid: { icon: ArrowUpRight, tone: 'text-foreground' },
	refunded: { icon: ArrowDownLeft, tone: 'text-emerald-600 dark:text-emerald-400' },
	pending: { icon: Clock, tone: 'text-amber-600 dark:text-amber-400' },
}

const Stat = ({ label, value }: { label: string; value: string }) => (
	<div className='p-4 sm:p-5'>
		<p className='font-mono text-[11px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-1.5 truncate font-space-grotesk text-xl font-bold tracking-tight tabular-nums sm:text-2xl'>
			{value}
		</p>
	</div>
)

const PaymentsView = () => {
	const { user } = useUser()
	const [cards, setCards] = useState(savedCards)
	const [filter, setFilter] = useState<TransactionStatus | 'all'>('all')
	const stats = getPaymentStats()

	const holder = (user?.fullName || user?.username || 'Ormo mijozi').toUpperCase()
	const visible = transactions.filter(tx => filter === 'all' || tx.status === filter)

	const makeDefault = (id: string) =>
		setCards(current => current.map(card => ({ ...card, isDefault: card.id === id })))

	const remove = (id: string) =>
		setCards(current => {
			const next = current.filter(card => card.id !== id)
			// Asosiy karta o'chirilsa — birinchisi asosiy bo'ladi
			return next.some(card => card.isDefault) ? next : next.map((card, index) => ({ ...card, isDefault: index === 0 }))
		})

	return (
		<>
			<PageHeader
				eyebrow={`Dashboard · To'lovlar · ${transactions.length} ta tranzaksiya`}
				title={
					<>
						To&apos;lovlar. <span className='text-muted-foreground'>Har bir so&apos;m hisobda.</span>
					</>
				}
				description="Saqlangan kartalar va barcha to'lovlar tarixi bir joyda."
			/>

			<div className='space-y-12'>
				<GridFrame className='grid grid-cols-2 divide-x divide-y bg-background md:grid-cols-4 md:divide-y-0'>
					<Stat label="Jami to'langan" value={formatPrice(stats.total)} />
					<Stat label='Qaytarilgan' value={formatPrice(stats.refunded)} />
					<Stat label="O'rtacha chek" value={formatPrice(stats.average)} />
					<Stat label='Sevimli usul' value={stats.favorite} />
				</GridFrame>

				{/* Kartalar */}
				<section className='space-y-4'>
					<div className='flex items-end justify-between gap-4'>
						<div className='space-y-1'>
							<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
								Saqlangan kartalar
							</h2>
							<p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
								<ShieldCheck className='size-4 text-emerald-600' />
								Karta raqami to&apos;liq saqlanmaydi — faqat oxirgi 4 raqam.
							</p>
						</div>
						<Tooltip>
							<TooltipTrigger
								render={
									<span tabIndex={0} className='inline-flex'>
										<Button variant='outline' disabled className='pointer-events-none'>
											<Plus />
											Karta qo&apos;shish
										</Button>
									</span>
								}
							/>
							<TooltipContent>To&apos;lov tizimi ulanganda ishga tushadi</TooltipContent>
						</Tooltip>
					</div>

					{cards.length > 0 ? (
						<div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
							{cards.map(card => (
								<div key={card.id} className='space-y-3'>
									<PaymentCard card={card} holder={holder} />
									<div className='flex items-center justify-between px-1 text-sm'>
										{card.isDefault ? (
											<span className='text-muted-foreground'>Buyurtmalarda avtomatik</span>
										) : (
											<button
												type='button'
												onClick={() => makeDefault(card.id)}
												className='text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
											>
												Asosiy qilish
											</button>
										)}
										<button
											type='button'
											onClick={() => remove(card.id)}
											className='text-muted-foreground transition-colors hover:text-destructive'
										>
											O&apos;chirish
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='flex flex-col items-center gap-3 border border-dashed px-6 py-12 text-center'>
							<CreditCard className='size-6 text-muted-foreground' />
							<p className='text-sm text-muted-foreground'>Saqlangan karta yo&apos;q. Click, Payme yoki naqd to&apos;lashingiz mumkin.</p>
						</div>
					)}
				</section>

				{/* Tranzaksiyalar */}
				<section className='space-y-4'>
					<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
						<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							To&apos;lovlar tarixi
						</h2>
						<div role='tablist' aria-label='Holat' className='flex overflow-x-auto border p-1'>
							{filters.map(item => {
								const count = transactions.filter(tx => item.value === 'all' || tx.status === item.value).length
								const active = filter === item.value
								return (
									<button
										key={item.value}
										type='button'
										role='tab'
										aria-selected={active}
										onClick={() => setFilter(item.value)}
										className={cn(
											'flex shrink-0 items-center gap-2 px-3 py-1.5 text-sm transition-colors',
											active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
										)}
									>
										{item.label}
										<span className={cn('font-mono text-[11px]', active ? 'text-background/70' : 'text-muted-foreground')}>
											{count}
										</span>
									</button>
								)
							})}
						</div>
					</div>

					<div className='overflow-hidden border bg-background'>
						{/* Ustun sarlavhalari — faqat keng ekranda */}
						<div className='hidden grid-cols-[1fr_8rem_8rem_9rem] gap-4 border-b bg-muted/40 px-5 py-2.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase md:grid'>
							<span>Tavsif</span>
							<span>Usul</span>
							<span>Holat</span>
							<span className='text-right'>Summa</span>
						</div>

						{visible.length > 0 ? (
							<ul className='divide-y'>
								{visible.map(tx => {
									const { icon: Icon, tone } = statusStyles[tx.status]
									return (
										<li
											key={tx.id}
											className='grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 transition-colors hover:bg-muted/30 md:grid-cols-[1fr_8rem_8rem_9rem]'
										>
											<div className='flex min-w-0 items-center gap-3'>
												<span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border', tone)}>
													<Icon className='size-3.5' />
												</span>
												<div className='min-w-0'>
													<p className='truncate text-sm font-medium'>
														<Link href='/dashboard/orders' className='underline-offset-4 hover:underline'>
															Buyurtma {tx.orderId}
														</Link>
													</p>
													<p className='font-mono text-[11px] text-muted-foreground'>
														{formatDate(tx.date, { time: true })} · {tx.items} dona
													</p>
												</div>
											</div>
											<span className='hidden text-sm text-muted-foreground md:block'>{tx.method}</span>
											<span className={cn('hidden text-sm md:block', tone)}>{TRANSACTION_LABELS[tx.status]}</span>
											<span
												className={cn(
													'text-right font-mono text-sm font-medium tabular-nums',
													tx.status === 'refunded' && 'text-emerald-600 dark:text-emerald-400'
												)}
											>
												{tx.status === 'refunded' ? '+' : '−'}
												{formatPrice(tx.amount)}
												<span className='block text-[11px] font-normal text-muted-foreground md:hidden'>
													{tx.method} · {TRANSACTION_LABELS[tx.status]}
												</span>
											</span>
										</li>
									)
								})}
							</ul>
						) : (
							<p className='px-5 py-10 text-center text-sm text-muted-foreground'>Bu holatda to&apos;lov yo&apos;q.</p>
						)}
					</div>
				</section>
			</div>
		</>
	)
}

export default PaymentsView
