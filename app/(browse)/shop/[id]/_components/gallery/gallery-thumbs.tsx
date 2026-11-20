import Image from 'next/image'

import type { ProductImage } from '@/lib/data/product-details'
import { cn } from '@/lib/utils'

type Props = {
	images: ProductImage[]
	active: number
	onSelect: (index: number) => void
}

/** Pastki tasma: raqamlangan kichik rasmlar, faoli qora ramkada */
const GalleryThumbs = ({ images, active, onSelect }: Props) => {
	return (
		<div className='flex gap-2 overflow-x-auto border-t p-3'>
			{images.map((image, index) => {
				const isActive = index === active

				return (
					<button
						key={image.src}
						type='button'
						onClick={() => onSelect(index)}
						aria-label={`${index + 1}-rasm: ${image.alt}`}
						aria-current={isActive}
						className={cn(
							'relative size-16 shrink-0 overflow-hidden rounded-md border bg-white transition-all',
							isActive
								? 'border-foreground ring-1 ring-foreground'
								: 'opacity-60 hover:opacity-100'
						)}
					>
						<Image
							src={image.src}
							alt=''
							fill
							sizes='64px'
							className={cn(
								image.kind === 'cutout'
									? 'mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain p-1.5'
									: 'object-cover'
							)}
						/>
						<span className='absolute bottom-0.5 left-1 font-mono text-[9px] text-muted-foreground mix-blend-difference'>
							{String(index + 1).padStart(2, '0')}
						</span>
					</button>
				)
			})}
		</div>
	)
}

export default GalleryThumbs
