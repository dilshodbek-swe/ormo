import type { Metadata } from 'next'

import OverviewView from './_components/overview/overview-view'

export const metadata: Metadata = {
	title: 'Umumiy ko‘rinish',
}

const DashboardPage = () => <OverviewView />

export default DashboardPage
