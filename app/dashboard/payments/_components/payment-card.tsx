import { Star } from 'lucide-react'

import { CARD_BRANDS, type SavedCard } from '@/lib/data/payments'
import { cn } from '@/lib/utils'

/** Kontaktsiz to'lov belgisi */
const Contactless = () => (
	<svg aria-hidden viewBox='0 0 24 24' className='size-5 opacity-70' fill='none' stroke='currentColor' strokeWidth='1.6'>
		<path d='M8.5 8a5.5 5.5 0 0 1 0 8M12 5.5a9 9 0 0 1 0 13M15.5 3a12.5 12.5 0 0 1 0 18' strokeLinecap='round' />
	</svg>
)

/** Karta chipi */
const Chip = () => (
	<span
		aria-hidden
		className='relative block h-7 w-9 overflow-hidden rounded-md bg-linear-to-br from-amber-200 via-amber-400 to-amber-600'
	>
		<span className='absolute inset-x-0 top-1/2 h-px bg-amber-800/40' />
		<span className='absolute inset-y-0 left-1/3 w-px bg-amber-800/40' />
		<span className='absolute inset-y-0 right-1/3 w-px bg-amber-800/40' />
	</span>
)

/** Bank kartasi vizuali — hover'da biroz ko'tariladi va yaltiraydi */
const PaymentCard = ({ card, holder }: { card: SavedCard; holder: string }) => {
	const brand = CARD_BRANDS[card.brand]

	return (
		<div
			className={cn(
				'group/card relative aspect-[1.586] w-full overflow-hidden rounded-2xl p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/10 transition-transform duration-500 ease-out hover:-translate-y-1',
				brand.className
			)}
		>
			{/* Yaltirash */}
			<span
				aria-hidden
				className='pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover/card:translate-x-full'
			/>
			{/* Nozik nuqtalar */}
			<span
				aria-hidden
				className='pointer-events-none absolute inset-0 bg-[radial-gradient(currentColor_0.5px,transparent_0.5px)] bg-size-[10px_10px] opacity-[0.07]'
			/>

			<div className='relative flex h-full flex-col justify-between'>
				<div className='flex items-start justify-between'>
					<span className='font-space-grotesk text-lg font-bold tracking-tight italic'>{brand.label}</span>
					{card.isDefault && (
						<span className='inline-flex items-center gap-1 rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-medium ring-1 ring-current/20'>
							<Star className='size-2.5 fill-current' />
							Asosiy
						</span>
					)}
				</div>

				<div className='flex items-center gap-3'>
					<Chip />
					<Contactless />
				</div>

				<div className='space-y-2'>
					<p className='font-mono text-base tracking-[0.2em] sm:text-lg'>
						•••• •••• •••• {card.last4}
					</p>
					<div className='flex items-end justify-between gap-4 font-mono text-[10px] tracking-widest uppercase opacity-80'>
						<span className='truncate'>{holder}</span>
						<span className='shrink-0'>{card.expires}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PaymentCard
