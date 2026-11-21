import type { Metadata } from 'next'

import WishlistView from './_components/wishlist-view'

export const metadata: Metadata = {
	title: 'Sevimlilar',
}

const WishlistPage = () => <WishlistView />

export default WishlistPage
