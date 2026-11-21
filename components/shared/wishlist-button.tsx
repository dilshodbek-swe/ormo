'use client'

import { Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { selectIsWished } from '@/lib/store/wishlist/wishlist-selectors'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
	productId: string
	productName: string
	size?: 'icon-sm' | 'icon-lg'
	className?: string
}

/** Yurakcha: mahsulotni sevimlilarga qo'shadi / olib tashlaydi */
const WishlistButton = ({ productId, productName, size = 'icon-sm', className }: WishlistButtonProps) => {
	const wished = useStore(selectIsWished(productId))
	const toggle = useStore(state => state.toggleWishlist)

	return (
		<Button
			variant='outline'
			size={size}
			onClick={() => toggle(productId)}
			aria-pressed={wished}
			aria-label={wished ? `${productName} — sevimlilardan olib tashlash` : `${productName} — sevimlilarga qo'shish`}
			className={cn('rounded-full bg-background/90 backdrop-blur', className)}
		>
			<Heart
				// key — holat o'zgarganda yurak "urib" qo'yadi
				key={String(wished)}
				className={cn(
					'transition-colors',
					wished && 'animate-in zoom-in-50 fill-rose-500 text-rose-500 duration-300'
				)}
			/>
		</Button>
	)
}

export default WishlistButton
