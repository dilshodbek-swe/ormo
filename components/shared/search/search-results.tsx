import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import type { Product } from '@/lib/data/products'
import { cn, formatPrice } from '@/lib/utils'

type Props = {
	products: Product[]
	activeIndex: number
	onHover: (index: number) => void
	onSelect: (product: Product) => void
}

/** Mos mahsulotlar: rasm, brend, nom va narx; faol qator klaviatura yoki sichqoncha bilan tanlanadi */
const SearchResults = ({ products, activeIndex, onHover, onSelect }: Props) => {
	return (
		<ul role='listbox' aria-label='Natijalar' className='p-2'>
			{products.map((product, index) => {
				const isActive = index === activeIndex

				return (
					<li key={product.id} role='option' aria-selected={isActive}>
						<button
							type='button'
							onMouseEnter={() => onHover(index)}
							onClick={() => onSelect(product)}
							className={cn(
								'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors',
								isActive ? 'bg-muted' : 'hover:bg-muted/60'
							)}
						>
							<span className='relative size-10 shrink-0 overflow-hidden rounded-md border bg-white'>
								<Image
									src={product.image}
									alt=''
									fill
									sizes='40px'
									className='mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain p-1'
								/>
							</span>
							<span className='min-w-0 flex-1'>
								<span className='block font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>
									{product.brand}
								</span>
								<span className='block truncate text-sm'>{product.name}</span>
							</span>
							<span className='font-mono text-xs text-muted-foreground tabular-nums'>
								{formatPrice(product.price)}
							</span>
							<ArrowUpRight
								className={cn(
									'size-4 shrink-0 text-muted-foreground transition-opacity',
									isActive ? 'opacity-100' : 'opacity-0'
								)}
							/>
						</button>
					</li>
				)
			})}
		</ul>
	)
}

export default SearchResults
