'use client'

import { useStore } from '@/lib/store'
import { useCartItems } from '@/lib/store/cart/cart-selectors'
import useStoreHydrated from '@/lib/store/use-store-hydrated'
import CartEmpty from './cart-empty'
import CartHeader from './cart-header'
import CartRecommendations from './cart-recommendations'
import CartSkeleton from './cart-skeleton'
import CartUndoToast from './cart-undo-toast'
import ClearCartButton from './clear-cart-button'
import CartLines from './lines/cart-lines'
import CartSummary from './summary/cart-summary'

/** Savat sahifasi joylashuvi — holat va mantiq store'da (lib/store/cart) */
const CartView = () => {
	const hydrated = useStoreHydrated()
	const items = useCartItems()
	const clearCart = useStore(state => state.clearCart)

	const isEmpty = hydrated && items.length === 0

	return (
		<div className='mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 md:py-14'>
			<CartHeader action={hydrated && !isEmpty && <ClearCartButton onConfirm={clearCart} />} />

			{!hydrated ? (
				<CartSkeleton />
			) : isEmpty ? (
				<CartEmpty />
			) : (
				<div className='grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]'>
					<CartLines items={items} />
					<div className='xl:sticky xl:top-24'>
						<CartSummary />
					</div>
				</div>
			)}

			{hydrated && <CartRecommendations cartIds={items.map(item => item.id)} />}

			<CartUndoToast />
		</div>
	)
}

export default CartView
