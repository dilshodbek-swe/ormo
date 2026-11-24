import { cn, formatPrice } from '@/lib/utils'
import { METHOD_ORDER, METHODS, type PaymentMethod, netOf, type Transaction } from '../_lib/transactions'

interface MethodBreakdownProps {
	transactions: Transaction[]
	active: PaymentMethod | 'all'
	onSelect: (method: PaymentMethod | 'all') => void
}

/**
 * To'lov usullari bo'yicha sof tushum: har biri o'z qatori (nom + summa + ulush) — rang faqat
 * identifikatsiya, matn esa doim yonida (yorug' rejimda ba'zi ranglar past kontrastli).
 * Qatorni bosish — jadvalni shu usul bo'yicha saralaydi.
 */
const MethodBreakdown = ({ transactions, active, onSelect }: MethodBreakdownProps) => {
	const rows = METHOD_ORDER.map(method => {
		const own = transactions.filter(item => item.method === method)
		return {
			method,
			net: own.reduce((sum, item) => sum + netOf(item), 0),
			count: own.filter(item => netOf(item) > 0).length,
			fees: own.reduce((sum, item) => sum + (item.status === 'failed' ? 0 : item.fee), 0),
		}
	})
	const total = Math.max(rows.reduce((sum, row) => sum + row.net, 0), 1)
	const max = Math.max(...rows.map(row => row.net), 1)

	return (
		<ul className='space-y-1'>
			{rows.map(row => {
				const selected = active === row.method
				return (
					<li key={row.method}>
						<button
							type='button'
							onClick={() => onSelect(selected ? 'all' : row.method)}
							aria-pressed={selected}
							className={cn(
								'w-full space-y-1.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/50',
								selected && 'bg-muted ring-1 ring-foreground/15',
								active !== 'all' && !selected && 'opacity-50'
							)}
						>
							<span className='flex items-baseline justify-between gap-2 text-sm'>
								<span className='flex items-center gap-2'>
									<span className={cn('size-2.5 rounded-[3px]', METHODS[row.method].tone)} />
									<span className='font-medium'>{METHODS[row.method].label}</span>
									<span className='text-xs text-muted-foreground'>{row.count} ta</span>
								</span>
								<span className='font-mono text-xs tabular-nums'>
									{formatPrice(row.net)}
									<span className='ml-2 text-muted-foreground'>{Math.round((row.net / total) * 100)}%</span>
								</span>
							</span>
							{/* Eng kattasiga nisbatan uzunlik — bir-biri bilan solishtirish oson */}
							<span className='block h-1.5 overflow-hidden rounded-full bg-muted'>
								<span
									className={cn('block h-full rounded-full transition-[width] duration-700', METHODS[row.method].tone)}
									style={{ width: `${(row.net / max) * 100}%` }}
								/>
							</span>
							<span className='block font-mono text-[10px] text-muted-foreground'>
								{METHODS[row.method].kind} · komissiya {(METHODS[row.method].fee * 100).toFixed(1)}% = {formatPrice(row.fees)}
							</span>
						</button>
					</li>
				)
			})}
		</ul>
	)
}

export default MethodBreakdown
