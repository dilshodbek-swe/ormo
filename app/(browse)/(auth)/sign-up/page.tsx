import type { Metadata } from 'next'
import { Suspense } from 'react'

import AuthSkeleton from '../_components/auth-skeleton'
import SignUpForm from './_components/sign-up-form'

export const metadata: Metadata = {
	title: "Ro'yxatdan o'tish — Ormo",
	description: 'Ormo akkauntini yarating.',
	robots: { index: false },
}

const SignUpPage = () => {
	return (
		<Suspense fallback={<AuthSkeleton fields={4} />}>
			<SignUpForm />
		</Suspense>
	)
}

export default SignUpPage
