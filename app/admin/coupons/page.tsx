import type { Metadata } from 'next'

import CouponsView from './_components/coupons-view'

export const metadata: Metadata = { title: 'Kuponlar' }

const AdminCouponsPage = () => <CouponsView />

export default AdminCouponsPage
