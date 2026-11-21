import type { Metadata } from 'next'

import PaymentsView from './_components/payments-view'

export const metadata: Metadata = {
	title: "To'lovlar",
}

const PaymentsPage = () => <PaymentsView />

export default PaymentsPage
