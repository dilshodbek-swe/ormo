'use client'

import { useSignUp } from '@clerk/nextjs'
import { UserRoundPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import AuthCard from '../../../_components/auth-card'
import FormAlert from '@/components/shared/form-alert'
import FormField from '@/components/shared/form-field'
import SubmitButton from '../../../_components/submit-button'
import { globalError, translateError } from '@/lib/clerk/errors'
import { useAuthRedirect } from '../../../_lib/use-auth-redirect'

/**
 * Google/GitHub orqali kelgan yangi foydalanuvchida yetishmayotgan maydonlarni
 * (odatda username) to'ldirish bosqichi.
 */
const ContinueForm = () => {
	const { signUp, errors, fetchStatus } = useSignUp()
	const uid = useId()
	const { navigate } = useAuthRedirect()
	const router = useRouter()

	const [username, setUsername] = useState('')
	const [localError, setLocalError] = useState<string>()

	const loading = fetchStatus === 'fetching'
	const needsUsername = signUp.missingFields.includes('username')
	const hasSession = signUp.status === 'missing_requirements'

	// To'g'ridan-to'g'ri ochilgan bo'lsa (davom ettiriladigan ro'yxatdan o'tish yo'q) — boshiga qaytaramiz
	useEffect(() => {
		if (fetchStatus === 'idle' && !hasSession) router.replace('/sign-up')
	}, [fetchStatus, hasSession, router])

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLocalError(undefined)

		const { error } = await signUp.update({ username: username.trim() })
		if (error) return

		if (signUp.status === 'complete') {
			const { error: finalizeError } = await signUp.finalize({ navigate })
			if (finalizeError) setLocalError(translateError(finalizeError))
			return
		}
		setLocalError("Ba'zi ma'lumotlar hali yetishmayapti. Qaytadan urinib ko'ring")
	}

	return (
		<AuthCard
			icon={<UserRoundPlus />}
			title='Oxirgi qadam'
			description={
				<>
					{signUp.firstName ? `${signUp.firstName}, a` : 'A'}kkauntingiz deyarli tayyor. Ormo&apos;da
					sizni qanday nom bilan tanishsin?
				</>
			}
		>
			<form onSubmit={handleSubmit} noValidate className='space-y-4'>
				{(needsUsername || !hasSession) && (
					<FormField
						id={`${uid}-username`}
						label='Username'
						error={translateError(errors.fields.username)}
						hint='Lotin harflari, raqamlar, "-" va "_" — kamida 4 ta belgi'
					>
						<div className='relative'>
							<span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground'>
								@
							</span>
							<Input
								id={`${uid}-username`}
								autoComplete='username'
								autoFocus
								value={username}
								onChange={event => setUsername(event.target.value)}
								placeholder='aziz_karimov'
								aria-invalid={Boolean(errors.fields.username)}
								className='h-10 pl-7'
								required
							/>
						</div>
					</FormField>
				)}

				<FormAlert message={localError ?? globalError(errors)} />

				<div id='clerk-captcha' />

				<SubmitButton loading={loading}>Akkauntni yaratish</SubmitButton>
			</form>
		</AuthCard>
	)
}

export default ContinueForm
