import type { Metadata } from 'next'
import { Suspense } from 'react'

import AuthSkeleton from '../_components/auth-skeleton'
import SignInForm from './_components/sign-in-form'

export const metadata: Metadata = {
	title: 'Kirish — Ormo',
	description: 'Ormo akkauntingizga kiring.',
	robots: { index: false },
}

const SignInPage = () => {
	return (
		<Suspense fallback={<AuthSkeleton />}>
			<SignInForm />
		</Suspense>
	)
}

export default SignInPage
