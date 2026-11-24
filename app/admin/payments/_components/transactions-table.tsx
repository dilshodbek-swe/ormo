'use client'

import { ChevronRight, ReceiptText } from 'lucide-react'

import { cn, formatPrice, formatRelative } from '@/lib/utils'
import { METHODS, STATUS, type Transaction, type TransactionStatus } from '../_lib/transactions'

export const StatusPill = ({ status }: { status: TransactionStatus }) => (
	<span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium', STATUS[status].className)}>
		<span className={cn('size-1.5 rounded-full', STATUS[status].dot)} />
		{STATUS[status].label}
	</span>
)

const COLUMNS = 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)_7.5rem_9rem_1rem]'

interface TransactionsTableProps {
	transactions: Transaction[]
	selectedId: string | null
	onSelect: (id: string) => void
	onReset: () => void
}

/** Vercel "Logs" uslubidagi zich ro'yxat: mono ID, usul nuqtasi, holat, o'ngda summa */
const TransactionsTable = ({ transactions, selectedId, onSelect, onReset }: TransactionsTableProps) => {
	if (transactions.length === 0) {
		return (
			<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center'>
				<span className='flex size-11 items-center justify-center rounded-xl border bg-background'>
					<ReceiptText className='size-5 text-muted-foreground' />
				</span>
				<p className='font-medium'>Bu filtrlar bo&apos;yicha to&apos;lov yo&apos;q</p>
				<button type='button' onClick={onReset} className='text-sm underline underline-offset-4'>
					Filtrlarni tozalash
				</button>
			</div>
		)
	}

	return (
		<div className='overflow-hidden rounded-xl border bg-background'>
			<div className={cn('hidden gap-4 border-b bg-muted/40 px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase md:grid', COLUMNS)}>
				<span>Tranzaksiya</span>
				<span>Mijoz</span>
				<span>Usul</span>
				<span>Holat</span>
				<span className='text-right'>Summa</span>
				<span />
			</div>
			<ul className='divide-y'>
				{transactions.map(item => (
					<li key={item.id}>
						<button
							type='button'
							onClick={() => onSelect(item.id)}
							className={cn(
								'group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none md:grid',
								COLUMNS,
								selectedId === item.id && 'bg-muted/60'
							)}
						>
							<span className='min-w-0'>
								<span className='block truncate font-mono text-sm'>{item.id}</span>
								<span className='block text-xs text-muted-foreground' suppressHydrationWarning>
									{formatRelative(item.createdAt)}
								</span>
							</span>

							<span className='order-3 col-span-2 min-w-0 md:order-0 md:col-span-1'>
								<span className='block truncate text-sm'>{item.customer.name}</span>
								<span className='block truncate font-mono text-[11px] text-muted-foreground'>{item.orderId}</span>
							</span>

							<span className='order-4 col-span-2 flex min-w-0 items-center gap-2 md:order-0 md:col-span-1'>
								<span className={cn('size-2 shrink-0 rounded-[2px]', METHODS[item.method].tone)} />
								<span className='text-sm'>{METHODS[item.method].label}</span>
								<span className='truncate font-mono text-[11px] text-muted-foreground'>{item.reference}</span>
							</span>

							<span className='hidden md:block'>
								<StatusPill status={item.status} />
							</span>

							<span className='text-right'>
								<span
									className={cn(
										'block font-mono text-sm tabular-nums',
										item.status === 'failed' && 'text-muted-foreground line-through',
										item.status === 'refunded' && 'text-muted-foreground'
									)}
								>
									{formatPrice(item.amount)}
								</span>
								{item.refunded > 0 && item.status !== 'refunded' ? (
									<span className='block font-mono text-[11px] text-muted-foreground'>−{formatPrice(item.refunded)} qaytdi</span>
								) : (
									<span className='block md:hidden'>
										<StatusPill status={item.status} />
									</span>
								)}
							</span>

							<ChevronRight className='hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block' />
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default TransactionsTable
