import type { Metadata } from 'next'

import ReviewsView from './_components/reviews-view'

export const metadata: Metadata = { title: 'Sharhlar' }

const AdminReviewsPage = () => <ReviewsView />

export default AdminReviewsPage
