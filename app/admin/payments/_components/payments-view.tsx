'use client'

import { Check, Download, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import PageHeader from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import {
	dailyNet,
	downloadTransactionsCsv,
	inRange,
	METHODS,
	type PaymentMethod,
	RANGES,
	type RangeKey,
	sampleTransactions,
	STATUS,
	STATUS_ORDER,
	summarize,
	type Transaction,
	type TransactionStatus,
} from '../_lib/transactions'
import MethodBreakdown from './method-breakdown'
import PaymentsKpis from './payments-kpis'
import RevenueChart from './revenue-chart'
import TransactionSheet from './transaction-sheet'
import TransactionsTable from './transactions-table'

const pad = (value: number) => String(value).padStart(2, '0')
const nowIso = () => {
	const date = new Date()
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * To'lovlar (namunaviy rejim): davr, usul va holat bo'yicha ko'rish, qaytarish shu sahifa xotirasida.
 * Backend ulanganda qaytarish — `requireAdmin()` bilan himoyalangan Server Action → provayder API.
 */
const PaymentsView = () => {
	const [transactions, setTransactions] = useState(sampleTransactions)
	const [range, setRange] = useState<RangeKey>('14d')
	const [method, setMethod] = useState<PaymentMethod | 'all'>('all')
	const [status, setStatus] = useState<TransactionStatus | 'all'>('all')
	const [query, setQuery] = useState('')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
	const searchRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(null), 3200)
		return () => clearTimeout(timer)
	}, [toast])

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			if (event.key !== '/' || target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
			event.preventDefault()
			searchRef.current?.focus()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	const days = RANGES.find(item => item.value === range)!.days
	const current = inRange(transactions, days)
	const previous = inRange(transactions, days, 1)
	const series = dailyNet(current, days)
	const now = summarize(current)

	const q = query.trim().toLowerCase()
	const byMethod = current.filter(
		item =>
			(method === 'all' || item.method === method) &&
			(!q || `${item.id} ${item.orderId} ${item.customer.name} ${item.reference}`.toLowerCase().includes(q))
	)
	const counts = Object.fromEntries(STATUS_ORDER.map(key => [key, byMethod.filter(item => item.status === key).length])) as Record<TransactionStatus, number>
	const visible = byMethod.filter(item => status === 'all' || item.status === status)
	const selected = transactions.find(item => item.id === selectedId) ?? null

	const refund = (id: string, amount: number, reason: string) => {
		const at = nowIso()
		setTransactions(list =>
			list.map((item): Transaction => {
				if (item.id !== id) return item
				const refunded = item.refunded + amount
				const full = refunded >= item.amount
				return {
					...item,
					refunded,
					status: full ? 'refunded' : item.status,
					refundReason: reason,
					events: [...item.events, { at, label: `${formatPrice(amount)} qaytarildi${full ? '' : ' (qisman)'}`, tone: 'neutral' }],
				}
			})
		)
		setToast({ id: Date.now(), text: `${formatPrice(amount)} mijozga qaytarildi` })
	}

	const reset = () => {
		setMethod('all')
		setStatus('all')
		setQuery('')
	}

	return (
		<>
			<PageHeader
				eyebrow={`Admin · Savdo · so'nggi ${days} kun`}
				title={
					<>
						To&apos;lovlar <span className='text-muted-foreground'>va tushum</span>
					</>
				}
				description="Click, Payme, karta va naqd to'lovlar bir joyda: komissiya, qaytarishlar va sof tushum."
				action={
					<div className='flex flex-wrap items-center gap-2'>
						{/* Davr — Vercel'dagi segmentli tanlov */}
						<div className='flex h-9 rounded-md border bg-background p-0.5' role='radiogroup' aria-label='Davr'>
							{RANGES.map(item => (
								<button
									key={item.value}
									type='button'
									role='radio'
									aria-checked={range === item.value}
									onClick={() => setRange(item.value)}
									className={cn(
										'rounded-[5px] px-3 text-sm transition-colors',
										range === item.value ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
									)}
								>
									{item.label}
								</button>
							))}
						</div>
						<Button variant='outline' className='h-9' onClick={() => downloadTransactionsCsv(visible)} disabled={visible.length === 0}>
							<Download />
							CSV
						</Button>
					</div>
				}
			/>

			<div className='space-y-6'>
				<PaymentsKpis now={now} before={summarize(previous)} />

				<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]'>
					<section className='rounded-xl border bg-background p-5'>
						<div className='mb-5 flex items-baseline justify-between gap-4'>
							<div>
								<h2 className='font-medium'>Kunlik sof tushum</h2>
								<p className='text-xs text-muted-foreground'>komissiya va qaytarishlar chegirilgan</p>
							</div>
							<p className='shrink-0 font-mono text-sm whitespace-nowrap tabular-nums'>{formatPrice(now.net)}</p>
						</div>
						<RevenueChart data={series} />
					</section>

					<section className='rounded-xl border bg-background p-3'>
						<div className='flex items-baseline justify-between px-2.5 pt-2 pb-3'>
							<h2 className='font-medium'>To&apos;lov usullari</h2>
							{method !== 'all' && (
								<button type='button' onClick={() => setMethod('all')} className='text-xs text-muted-foreground hover:text-foreground'>
									Hammasi
								</button>
							)}
						</div>
						<MethodBreakdown transactions={current} active={method} onSelect={setMethod} />
					</section>
				</div>

				<div className='space-y-3'>
					<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
						<div className='-mx-1 flex gap-1 overflow-x-auto px-1' role='tablist' aria-label="Holat bo'yicha">
							{(['all', ...STATUS_ORDER] as const).map(key => {
								const active = status === key
								return (
									<button
										key={key}
										type='button'
										role='tab'
										aria-selected={active}
										onClick={() => setStatus(key)}
										className={cn(
											'flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
											active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
										)}
									>
										{key !== 'all' && <span className={cn('size-1.5 rounded-full', STATUS[key].dot)} />}
										{key === 'all' ? 'Hammasi' : STATUS[key].label}
										<span className={cn('rounded-full px-1.5 font-mono text-[10px] tabular-nums', active ? 'bg-background/20' : 'bg-muted')}>
											{key === 'all' ? byMethod.length : counts[key]}
										</span>
									</button>
								)
							})}
						</div>
						<div className='flex gap-2'>
							{method !== 'all' && (
								<button
									type='button'
									onClick={() => setMethod('all')}
									className='flex h-9 shrink-0 items-center gap-2 rounded-md border bg-background px-3 text-sm'
								>
									<span className={cn('size-2 rounded-[2px]', METHODS[method].tone)} />
									{METHODS[method].label}
									<X className='size-3.5 text-muted-foreground' />
								</button>
							)}
							<label className='relative flex h-9 min-w-0 flex-1 items-center rounded-md border bg-background focus-within:ring-3 focus-within:ring-ring/30 lg:w-72 lg:flex-none'>
								<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
								<input
									ref={searchRef}
									value={query}
									onChange={event => setQuery(event.target.value)}
									onKeyDown={event => {
										if (event.key === 'Escape') {
											setQuery('')
											event.currentTarget.blur()
										}
									}}
									placeholder='TXN, buyurtma, mijoz, havola...'
									aria-label="To'lovlarni qidirish"
									className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
								/>
								<kbd className='mr-2.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground'>/</kbd>
							</label>
						</div>
					</div>

					<TransactionsTable transactions={visible} selectedId={selectedId} onSelect={setSelectedId} onReset={reset} />
					<p className='px-1 font-mono text-[11px] text-muted-foreground'>
						{visible.length} ta to&apos;lov · namunaviy ma&apos;lumotlar va komissiya stavkalari — qaytarishlar sahifa yangilanguncha saqlanadi
					</p>
				</div>
			</div>

			<TransactionSheet transaction={selected} onClose={() => setSelectedId(null)} onRefund={refund} />

			{toast && (
				<div
					key={toast.id}
					role='status'
					className='fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm animate-in items-center gap-2.5 rounded-xl border bg-foreground px-4 py-3 text-sm text-background shadow-2xl fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6'
				>
					<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<Check className='size-3' />
					</span>
					<span className='min-w-0 truncate'>{toast.text}</span>
				</div>
			)}
		</>
	)
}

export default PaymentsView
