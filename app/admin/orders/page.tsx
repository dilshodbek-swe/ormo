import type { Metadata } from 'next'

import OrdersView from './_components/orders-view'

export const metadata: Metadata = { title: 'Buyurtmalar' }

const AdminOrdersPage = () => <OrdersView />

export default AdminOrdersPage
