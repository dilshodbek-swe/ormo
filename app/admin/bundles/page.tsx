import type { Metadata } from 'next'

import BundlesView from './_components/bundles-view'

export const metadata: Metadata = { title: "To'plamlar" }

const AdminBundlesPage = () => <BundlesView />

export default AdminBundlesPage
