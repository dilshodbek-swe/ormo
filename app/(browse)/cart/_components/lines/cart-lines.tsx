'use client'

import GridFrame from '@/components/shared/grid-frame'
import { useStore } from '@/lib/store'
import type { CartItem } from '@/lib/store/cart/cart-selectors'
import CartLine from './cart-line'

const CartLines = ({ items }: { items: CartItem[] }) => {
	const setCartQuantity = useStore(state => state.setCartQuantity)
	const removeFromCart = useStore(state => state.removeFromCart)

	return (
		<GridFrame>
			<div
				aria-hidden
				className='flex justify-between border-b bg-muted/30 px-5 py-2.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase'
			>
				<span>Mahsulot</span>
				<span className='hidden md:inline md:pr-12'>Jami</span>
			</div>

			<ul className='divide-y'>
				{items.map((item, index) => (
					<CartLine
						key={item.id}
						index={index}
						product={item.product}
						quantity={item.quantity}
						stock={item.stock}
						onQuantityChange={quantity => setCartQuantity(item.id, quantity)}
						onRemove={() => removeFromCart(item.id)}
					/>
				))}
			</ul>
		</GridFrame>
	)
}

export default CartLines
