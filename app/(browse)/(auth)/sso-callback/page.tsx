import type { Metadata } from 'next'
import { Suspense } from 'react'

import SSOCallbackHandler from './_components/sso-callback-handler'

export const metadata: Metadata = {
	title: 'Tekshirilmoqda — Ormo',
	robots: { index: false },
}

const SSOCallbackPage = () => {
	return (
		<Suspense>
			<SSOCallbackHandler />
		</Suspense>
	)
}

export default SSOCallbackPage
