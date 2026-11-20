import { ArrowRight, Lock } from 'lucide-react'
import type { ReactNode } from 'react'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'
import type { CartTotals } from '@/lib/cart/pricing'
import { cn, formatPrice } from '@/lib/utils'
import FreeShippingMeter from './free-shipping-meter'
import PromoCodeForm, { type AppliedPromo } from './promo-code-form'

type Props = {
	count: number
	totals: CartTotals
	/** Mahsulotlarning o'z chegirmalari bo'yicha tejash */
	savings: number
	promo: AppliedPromo | null
	onApplyPromo: (promo: AppliedPromo) => void
	onRemovePromo: () => void
}

const Row = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
	<div className={cn('flex items-baseline justify-between gap-4 py-2', className)}>
		<dt className='text-sm text-muted-foreground'>{label}</dt>
		<dd className='font-mono text-sm tabular-nums'>{children}</dd>
	</div>
)

/** Chek ko'rinishidagi hisob: oraliq summa, chegirmalar, yetkazish va jami */
const CartSummary = ({ count, totals, savings, promo, onApplyPromo, onRemovePromo }: Props) => {
	return (
		<GridFrame as='section' className='space-y-6 p-6'>
			<div className='flex items-center justify-between'>
				<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Buyurtma
				</h2>
				<span className='font-mono text-xs text-muted-foreground'>{count} dona</span>
			</div>

			<FreeShippingMeter untilFree={totals.untilFreeShipping} />

			<dl className='divide-y divide-dashed border-y border-dashed'>
				<Row label='Mahsulotlar'>{formatPrice(totals.subtotal)}</Row>
				{savings > 0 && (
					<Row label='Chegirmalar'>
						<span className='text-emerald-700 dark:text-emerald-400'>
							{formatPrice(savings)} tejaldi
						</span>
					</Row>
				)}
				{promo && (
					<Row label={`Promo-kod (${promo.code})`}>−{formatPrice(totals.promoDiscount)}</Row>
				)}
				<Row label='Yetkazish'>{totals.shipping === 0 ? 'Bepul' : formatPrice(totals.shipping)}</Row>
			</dl>

			<div className='flex items-end justify-between gap-4'>
				<span className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Jami
				</span>
				{/* key — summa o'zgarganda yangi qiymat yuqoridan sirg'alib keladi */}
				<p
					key={totals.total}
					className='animate-in fade-in slide-in-from-top-1 font-mono text-2xl font-bold tracking-tight tabular-nums duration-300'
				>
					{formatPrice(totals.total)}
				</p>
			</div>

			<PromoCodeForm applied={promo} onApply={onApplyPromo} onRemove={onRemovePromo} />

			<div className='space-y-3'>
				<Button size='lg' className='group h-11 w-full justify-between px-4'>
					Rasmiylashtirish
					<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
				</Button>
				<p className='flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground'>
					<Lock className='size-3' />
					Xavfsiz to&apos;lov · Click · Payme · Uzcard
				</p>
			</div>
		</GridFrame>
	)
}

export default CartSummary
