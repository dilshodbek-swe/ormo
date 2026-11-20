import type { Metadata } from 'next'

import SettingsView from './_components/settings-view'

export const metadata: Metadata = {
	title: 'Sozlamalar — Ormo',
	robots: { index: false },
}

const SettingsPage = () => <SettingsView />

export default SettingsPage
