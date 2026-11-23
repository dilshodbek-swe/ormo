import type { Metadata } from 'next'

import ProductsView from './_components/products-view'

export const metadata: Metadata = { title: 'Mahsulotlar' }

const AdminProductsPage = () => <ProductsView />

export default AdminProductsPage
