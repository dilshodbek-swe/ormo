import { cn } from '@/lib/utils'

const SEGMENTS = 10

/** Ombordagi qoldiq: 10 bo'lakli chiziq, kam qolganda olov rangida */
const ProductStock = ({ stock }: { stock: number }) => {
	const isLow = stock > 0 && stock <= 3
	const filled = Math.min(stock, SEGMENTS)

	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between font-mono text-xs'>
				<span className='text-muted-foreground'>Omborda</span>
				<span className={cn('font-semibold', isLow && 'text-orange-600')}>
					{stock === 0 ? 'Tugagan' : isLow ? `Atigi ${stock} dona qoldi` : `${stock} dona`}
				</span>
			</div>
			<div className='grid grid-cols-10 gap-1' aria-hidden>
				{Array.from({ length: SEGMENTS }, (_, index) => (
					<span
						key={index}
						className={cn(
							'h-1 rounded-full',
							index >= filled
								? 'bg-border'
								: isLow
									? 'bg-linear-to-r from-orange-500 to-rose-500'
									: 'bg-foreground'
						)}
					/>
				))}
			</div>
		</div>
	)
}

export default ProductStock
