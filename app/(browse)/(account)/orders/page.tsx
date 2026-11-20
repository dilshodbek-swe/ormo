import type { Metadata } from 'next'

import OrdersView from './_components/orders-view'

export const metadata: Metadata = {
	title: 'Buyurtmalar — Ormo',
	robots: { index: false },
}

const OrdersPage = () => <OrdersView />

export default OrdersPage
