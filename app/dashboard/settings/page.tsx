import type { Metadata } from 'next'

import SettingsView from './_components/settings-view'

export const metadata: Metadata = {
	title: 'Sozlamalar',
}

const SettingsPage = () => <SettingsView />

export default SettingsPage
