import type { Metadata } from 'next'

import DealsView from './_components/deals-view'

export const metadata: Metadata = { title: 'Aksiyalar' }

const AdminDealsPage = () => <DealsView />

export default AdminDealsPage
