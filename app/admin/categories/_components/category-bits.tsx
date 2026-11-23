import { ImageOff } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { CategoryImage } from '../_lib/types'

/** Kategoriya rasmi: blob: (yangi tanlangan) uchun optimizatsiyasiz; oq fon nuqtali fonga qo'shilib ketadi */
export const CategoryImg = ({ image, sizes, className }: { image: CategoryImage | null; sizes: string; className?: string }) =>
	image ? (
		<Image
			src={image.url}
			alt=''
			fill
			sizes={sizes}
			unoptimized={image.url.startsWith('blob:')}
			className={cn('object-contain mix-blend-multiply dark:mix-blend-normal', className)}
		/>
	) : (
		<span className='absolute inset-0 flex items-center justify-center text-muted-foreground/60'>
			<ImageOff className='size-4' />
		</span>
	)
