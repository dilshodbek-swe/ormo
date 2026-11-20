import type { Metadata } from 'next'
import { Suspense } from 'react'

import AuthSkeleton from '../_components/auth-skeleton'
import ForgotPasswordForm from './_components/forgot-password-form'

export const metadata: Metadata = {
	title: 'Parolni tiklash — Ormo',
	robots: { index: false },
}

const ForgotPasswordPage = () => {
	return (
		<Suspense fallback={<AuthSkeleton fields={1} />}>
			<ForgotPasswordForm />
		</Suspense>
	)
}

export default ForgotPasswordPage
