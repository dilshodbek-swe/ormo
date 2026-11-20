'use client'

import type { ProductWithDetails } from '@/lib/data/product-details'
import { cn } from '@/lib/utils'
import GalleryControls from './gallery-controls'
import GalleryReadout from './gallery-readout'
import GallerySlide from './gallery-slide'
import GalleryThumbs from './gallery-thumbs'
import useGallery from './use-gallery'

/**
 * Nuqtali "chizma" fonidagi galereya. Bir nechta rasm bo'lsa — tugmalar, kichik rasmlar,
 * ← → strelkalari va barmoq bilan surish; bitta bo'lsa — faqat sahna.
 */
const ProductGallery = ({ product }: { product: ProductWithDetails }) => {
	const { images } = product
	const { index, point, goTo, next, prev, stageHandlers } = useGallery(images.length)
	const hasMany = images.length > 1
	const active = images[index]

	return (
		<div className='flex flex-col'>
			<div
				{...stageHandlers}
				tabIndex={hasMany ? 0 : undefined}
				role={hasMany ? 'region' : undefined}
				aria-roledescription={hasMany ? 'galereya' : undefined}
				aria-label={hasMany ? `${product.name} suratlari` : undefined}
				className={cn(
					'group/stage relative aspect-square flex-1 cursor-crosshair touch-pan-y overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset lg:aspect-auto lg:min-h-[36rem]',
					// To'liq kadrli suratda nuqtali fon kerak emas
					active.kind === 'cutout' &&
						'bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[18px_18px]'
				)}
			>
				{/* Markazdagi nishon chiziqlari — faqat cutout uchun */}
				{active.kind === 'cutout' && (
					<>
						<span aria-hidden className='absolute inset-x-0 top-1/2 h-px bg-border' />
						<span aria-hidden className='absolute inset-y-0 left-1/2 w-px bg-border' />
					</>
				)}

				{images.map((image, imageIndex) => (
					<GallerySlide
						key={image.src}
						image={image}
						isActive={imageIndex === index}
						point={imageIndex === index ? point : null}
						preload={imageIndex === 0}
					/>
				))}

				{product.discount > 0 && (
					<span className='absolute top-4 left-4 z-10 rounded-full bg-foreground px-2.5 py-1 font-mono text-xs font-semibold text-background'>
						-{product.discount}%
					</span>
				)}

				{hasMany && <GalleryControls onPrev={prev} onNext={next} />}

				<GalleryReadout
					point={point}
					index={index}
					count={images.length}
					onPhoto={active.kind === 'photo'}
				/>
			</div>

			{hasMany && <GalleryThumbs images={images} active={index} onSelect={goTo} />}
		</div>
	)
}

export default ProductGallery
