import type { Metadata } from 'next'

import CartView from './_components/cart-view'

export const metadata: Metadata = {
	title: 'Savat — Ormo',
	description: 'Tanlangan mahsulotlar, miqdor, promo-kod va buyurtma hisobi.',
	robots: { index: false },
}

const CartPage = () => {
	return <CartView />
}

export default CartPage
