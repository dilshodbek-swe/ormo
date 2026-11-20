import type { Metadata } from 'next'
import { Suspense } from 'react'

import AuthSkeleton from '../../_components/auth-skeleton'
import ContinueForm from './_components/continue-form'

export const metadata: Metadata = {
	title: "Ro'yxatdan o'tishni yakunlash — Ormo",
	robots: { index: false },
}

const SignUpContinuePage = () => {
	return (
		<Suspense fallback={<AuthSkeleton fields={1} />}>
			<ContinueForm />
		</Suspense>
	)
}

export default SignUpContinuePage
