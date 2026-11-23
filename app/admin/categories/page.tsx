import type { Metadata } from 'next'

import CategoriesView from './_components/categories-view'

export const metadata: Metadata = { title: 'Kategoriyalar' }

const AdminCategoriesPage = () => <CategoriesView />

export default AdminCategoriesPage
