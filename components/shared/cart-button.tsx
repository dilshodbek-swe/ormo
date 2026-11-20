'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import useCart from '@/lib/cart/use-cart'

/** Headerdagi savat: ichidagi mahsulotlar soni bilan, /cart sahifasiga olib boradi */
const CartButton = () => {
	const { count } = useCart()

	return (
		<Button
			variant='ghost'
			size='icon'
			nativeButton={false}
			render={<Link href='/cart' />}
			aria-label={count > 0 ? `Savat — ${count} ta mahsulot` : 'Savat'}
			className='relative'
		>
			<ShoppingBag />
			{count > 0 && (
				// key — son o'zgarganda belgi "sakraydi"
				<span
					key={count}
					className='animate-in zoom-in-50 absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background tabular-nums duration-300'
				>
					{count > 99 ? '99+' : count}
				</span>
			)}
		</Button>
	)
}

export default CartButton
