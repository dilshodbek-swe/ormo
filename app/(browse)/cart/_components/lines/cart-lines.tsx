import GridFrame from '@/components/shared/grid-frame'
import type useCart from '@/lib/cart/use-cart'
import CartLine from './cart-line'

type CartItem = ReturnType<typeof useCart>['items'][number]

type Props = {
	items: CartItem[]
	onQuantityChange: (id: string, quantity: number) => void
	onRemove: (id: string) => void
}

const CartLines = ({ items, onQuantityChange, onRemove }: Props) => {
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
						onQuantityChange={quantity => onQuantityChange(item.id, quantity)}
						onRemove={() => onRemove(item.id)}
					/>
				))}
			</ul>
		</GridFrame>
	)
}

export default CartLines
