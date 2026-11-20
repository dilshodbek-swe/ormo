import Image from 'next/image'
import type { CSSProperties } from 'react'

import type { ProductImage } from '@/lib/data/product-details'
import { cn } from '@/lib/utils'
import type { ZoomPoint } from './use-gallery'

type Props = {
	image: ProductImage
	isActive: boolean
	/** Faqat faol slaydga beriladi — kursor turgan nuqta kattalashadi */
	point: ZoomPoint | null
	preload?: boolean
}

const ZOOM = 'scale-[1.8]'

/**
 * Bitta surat. Cutout — oq doira plitada, chetlari xiralashgan;
 * photo — butun sahnani to'ldiradi. Ikkalasida ham kursor ostidagi nuqta kattalashadi.
 */
const GallerySlide = ({ image, isActive, point, preload }: Props) => {
	const zoomStyle: CSSProperties | undefined = point
		? { transformOrigin: `${point.x * 100}% ${point.y * 100}%` }
		: undefined

	return (
		<div
			aria-hidden={!isActive}
			className={cn(
				'absolute inset-0 flex items-center justify-center transition-all duration-500',
				isActive ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
			)}
		>
			{image.kind === 'cutout' ? (
				<div className='relative flex aspect-square w-[70%] max-w-lg items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_0_0_1px_var(--border),0_30px_60px_-30px_rgb(0_0_0/0.35)]'>
					<Image
						src={image.src}
						alt={image.alt}
						width={1200}
						height={1200}
						sizes='(min-width: 1024px) 40vw, 90vw'
						preload={preload}
						className={cn(
							'h-[70%] w-auto max-w-[80%] mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-300 ease-out',
							point && ZOOM
						)}
						style={zoomStyle}
					/>
				</div>
			) : (
				<Image
					src={image.src}
					alt={image.alt}
					fill
					sizes='(min-width: 1024px) 55vw, 100vw'
					preload={preload}
					className={cn(
						'object-cover transition-transform duration-300 ease-out',
						point && ZOOM
					)}
					style={zoomStyle}
				/>
			)}
		</div>
	)
}

export default GallerySlide
