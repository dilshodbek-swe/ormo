import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn, formatPrice } from '@/lib/utils'
import type { summarize } from '../_lib/transactions'

type Summary = ReturnType<typeof summarize>

export const compact = (value: number) =>
	value >= 1_000_000_000
		? `${(value / 1_000_000_000).toFixed(2)} mlrd`
		: value >= 1_000_000
			? `${(value / 1_000_000).toFixed(1)} mln`
			: formatPrice(value).replace(" so'm", '')

/** Oldingi davrga nisbatan o'zgarish (%) — `inverse` bo'lsa o'sish yomon (masalan, qaytarishlar) */
const Delta = ({ now, before, inverse = false }: { now: number; before: number; inverse?: boolean }) => {
	if (!before && !now) return <span className='font-mono text-[11px] text-muted-foreground'>—</span>
	if (!before) return <span className='font-mono text-[11px] text-muted-foreground'>yangi</span>
	const change = ((now - before) / before) * 100
	const up = change >= 0
	const good = inverse ? !up : up
	return (
		<span
			className={cn(
				'inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums',
				good ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
			)}
			title='Oldingi shunday davrga nisbatan'
		>
			{up ? <ArrowUpRight className='size-3' /> : <ArrowDownRight className='size-3' />}
			{Math.abs(change).toFixed(0)}%
		</span>
	)
}

/** To'rt ko'rsatkich: sof tushum, komissiya, qaytarilgan, muvaffaqiyat darajasi (halqa bilan) */
const PaymentsKpis = ({ now, before }: { now: Summary; before: Summary }) => {
	const rate = Math.round(now.successRate * 100)
	const circumference = 2 * Math.PI * 16

	return (
		<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4'>
			<Cell label='Sof tushum' hint={`${compact(now.gross)} so'm yalpi`} delta={<Delta now={now.net} before={before.net} />}>
				{compact(now.net)}
				<span className='ml-1 text-base font-medium text-muted-foreground'>so&apos;m</span>
			</Cell>
			<Cell label='Komissiya' hint="provayderlarga to'langan" delta={<Delta now={now.fees} before={before.fees} inverse />}>
				{compact(now.fees)}
				<span className='ml-1 text-base font-medium text-muted-foreground'>so&apos;m</span>
			</Cell>
			<Cell label='Qaytarilgan' hint={`${compact(now.pending)} so'm naqd kutilmoqda`} delta={<Delta now={now.refunded} before={before.refunded} inverse />}>
				{compact(now.refunded)}
				<span className='ml-1 text-base font-medium text-muted-foreground'>so&apos;m</span>
			</Cell>
			<div className='flex items-center gap-3 bg-background p-4 sm:gap-4 sm:p-5'>
				<svg viewBox='0 0 40 40' className='size-10 shrink-0 -rotate-90 sm:size-14' aria-hidden>
					<circle cx='20' cy='20' r='16' fill='none' strokeWidth='4' className='stroke-muted' />
					<circle
						cx='20'
						cy='20'
						r='16'
						fill='none'
						strokeWidth='4'
						strokeLinecap='round'
						className='stroke-foreground transition-[stroke-dashoffset] duration-700'
						strokeDasharray={circumference}
						strokeDashoffset={circumference * (1 - now.successRate)}
					/>
				</svg>
				<div className='min-w-0'>
					<p className='truncate font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Muvaffaqiyat</p>
					<p className='mt-1 font-space-grotesk text-2xl font-bold tracking-tight tabular-nums sm:text-3xl'>{rate}%</p>
					<p className='truncate text-xs text-muted-foreground'>karta/hamyon urinishlari</p>
				</div>
			</div>
		</div>
	)
}

const Cell = ({ label, hint, delta, children }: { label: string; hint: string; delta: ReactNode; children: ReactNode }) => (
	<div className='bg-background p-4 sm:p-5'>
		<div className='flex items-center justify-between gap-2'>
			<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
			{delta}
		</div>
		<p className='mt-2 font-space-grotesk text-2xl font-bold tracking-tight tabular-nums sm:text-3xl'>{children}</p>
		<p className='mt-1 truncate text-xs text-muted-foreground'>{hint}</p>
	</div>
)

export default PaymentsKpis
