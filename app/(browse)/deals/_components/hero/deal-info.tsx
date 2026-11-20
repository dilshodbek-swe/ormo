import AddToCartButton from '@/components/shared/add-to-cart-button'
import type { Deal } from '@/lib/data/deals'
import DealPrice from './deal-price'

/** Faol taklif haqida: brend, nom, narx va savat tugmasi */
const DealInfo = ({ deal }: { deal: Deal }) => {
	return (
		<div className='animate-in fade-in slide-in-from-left-2 space-y-6 duration-500'>
			<div className='space-y-1'>
				<p className='font-mono text-xs tracking-widest uppercase opacity-60'>{deal.brand}</p>
				<h2 className='font-space-grotesk text-2xl font-bold tracking-tight text-balance sm:text-3xl'>
					{deal.name}
				</h2>
			</div>

			<DealPrice deal={deal} />

			<AddToCartButton
				productIds={deal.id}
				size='lg'
				className='h-11 bg-background px-6 text-foreground hover:bg-background/90'
			>
				Savatga qo&apos;shish
			</AddToCartButton>
		</div>
	)
}

export default DealInfo
