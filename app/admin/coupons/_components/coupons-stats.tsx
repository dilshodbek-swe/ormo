import { formatPrice } from '@/lib/utils'
import { type Coupon, type CouponStatus } from '../_lib/types'

const compact = (value: number) =>
	value >= 1_000_000_000 ? `${(value / 1_000_000_000).toFixed(2)} mlrd` : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} mln` : formatPrice(value)

interface CouponsStatsProps {
	coupons: Coupon[]
	statuses: Record<string, CouponStatus>
}

/** Kuponlar samaradorligi: nechta faol, necha marta ishlatilgan, qancha chegirma berilgan va evaziga savdo */
const CouponsStats = ({ coupons, statuses }: CouponsStatsProps) => {
	const active = coupons.filter(coupon => statuses[coupon.id] === 'active').length
	const scheduled = coupons.filter(coupon => statuses[coupon.id] === 'scheduled').length
	const uses = coupons.reduce((sum, coupon) => sum + coupon.uses, 0)
	const given = coupons.reduce((sum, coupon) => sum + coupon.discountGiven, 0)
	const revenue = coupons.reduce((sum, coupon) => sum + coupon.revenue, 0)
	const top = [...coupons].sort((a, b) => b.revenue - a.revenue).slice(0, 3)
	const topMax = Math.max(top[0]?.revenue ?? 1, 1)

	return (
		<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border xl:grid-cols-4'>
			<Cell label='Faol kuponlar' value={active} hint={scheduled ? `+${scheduled} ta rejalashtirilgan` : `${coupons.length} tadan`} />
			<Cell label='Ishlatilgan' value={uses.toLocaleString('ru-RU')} hint='jami buyurtmalarda' />
			<Cell
				label='Berilgan chegirma'
				value={`${compact(given)} so'm`}
				hint={given ? `har 1 so'mga ${(revenue / given).toFixed(1)} so'm savdo` : '—'}
				className='col-span-2 sm:col-span-1'
			/>
			<div className='col-span-2 bg-background p-4 sm:col-span-1 sm:p-5'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Eng ko&apos;p savdo</p>
				<ol className='mt-2.5 space-y-2'>
					{top.map((coupon, index) => (
						<li key={coupon.id} className='space-y-1'>
							<div className='flex items-baseline justify-between gap-2 text-xs'>
								<span className='flex min-w-0 items-center gap-1.5'>
									<span className='font-mono text-[10px] text-muted-foreground'>{index + 1}</span>
									<span className='truncate font-mono font-medium'>{coupon.code}</span>
								</span>
								<span className='font-mono text-muted-foreground tabular-nums'>{compact(coupon.revenue)}</span>
							</div>
							<div className='h-1 overflow-hidden rounded-full bg-muted'>
								<div className='h-full rounded-full bg-foreground/70' style={{ width: `${(coupon.revenue / topMax) * 100}%` }} />
							</div>
						</li>
					))}
				</ol>
			</div>
		</div>
	)
}

const Cell = ({ label, value, hint, className = '' }: { label: string; value: string | number; hint: string; className?: string }) => (
	<div className={`bg-background p-4 sm:p-5 ${className}`}>
		<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>{label}</p>
		<p className='mt-2 font-space-grotesk text-2xl font-bold tracking-tight whitespace-nowrap tabular-nums sm:text-3xl'>{value}</p>
		<p className='mt-1 truncate text-xs text-muted-foreground'>{hint}</p>
	</div>
)

export default CouponsStats
