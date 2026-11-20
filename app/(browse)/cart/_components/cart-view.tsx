'use client'

import { useState } from 'react'

import { computeTotals } from '@/lib/cart/pricing'
import useCart from '@/lib/cart/use-cart'
import CartEmpty from './cart-empty'
import CartHeader from './cart-header'
import CartRecommendations from './cart-recommendations'
import CartSkeleton from './cart-skeleton'
import ClearCartButton from './clear-cart-button'
import CartLines from './lines/cart-lines'
import CartSummary from './summary/cart-summary'
import type { AppliedPromo } from './summary/promo-code-form'
import UndoToast from './undo-toast'
import useUndoRemove, { UNDO_MS } from './use-undo-remove'

const CartView = () => {
	const cart = useCart()
	const { removed, remove, undo } = useUndoRemove(cart)
	const [promo, setPromo] = useState<AppliedPromo | null>(null)

	const isEmpty = cart.hydrated && cart.items.length === 0
	const totals = computeTotals(cart.subtotal, promo?.percent)

	return (
		<div className='mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 md:py-14'>
			<CartHeader
				count={cart.count}
				action={!isEmpty && cart.hydrated && <ClearCartButton onConfirm={cart.clear} />}
			/>

			{!cart.hydrated ? (
				<CartSkeleton />
			) : isEmpty ? (
				<CartEmpty />
			) : (
				<div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]'>
					<CartLines
						items={cart.items}
						onQuantityChange={cart.setQuantity}
						onRemove={remove}
					/>
					<div className='lg:sticky lg:top-24'>
						<CartSummary
							count={cart.count}
							totals={totals}
							savings={cart.savings}
							promo={promo}
							onApplyPromo={setPromo}
							onRemovePromo={() => setPromo(null)}
						/>
					</div>
				</div>
			)}

			{cart.hydrated && <CartRecommendations cartIds={cart.items.map(item => item.id)} />}

			{removed && (
				<UndoToast key={removed.line.id} name={removed.name} onUndo={undo} durationMs={UNDO_MS} />
			)}
		</div>
	)
}

export default CartView
