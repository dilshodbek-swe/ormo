'use client'

import { useSignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { type FormEvent, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import AuthCard from '../../_components/auth-card'
import CodeStep from '../../_components/code-step'
import FormAlert from '@/components/shared/form-alert'
import FormField from '@/components/shared/form-field'
import OAuthButtons from '../../_components/oauth-buttons'
import PasswordInput from '@/components/shared/password-input'
import SubmitButton from '../../_components/submit-button'
import { globalError, translateError } from '@/lib/clerk/errors'
import { useAuthRedirect } from '../../_lib/use-auth-redirect'
import { useRedirectIfSignedIn } from '../../_lib/use-redirect-if-signed-in'

type Step = 'credentials' | 'client-trust'

const SignInForm = () => {
	const { signIn, errors, fetchStatus } = useSignIn()
	const uid = useId()
	const { navigate, withRedirect } = useAuthRedirect()
	useRedirectIfSignedIn()

	const [step, setStep] = useState<Step>('credentials')
	const [identifier, setIdentifier] = useState('')
	const [password, setPassword] = useState('')
	const [localError, setLocalError] = useState<string>()

	const loading = fetchStatus === 'fetching'
	const formError = localError ?? globalError(errors)

	/** Holatga qarab keyingi qadamni tanlaydi */
	const proceed = async () => {
		switch (signIn.status) {
			case 'complete':
				await signIn.finalize({ navigate })
				return
			case 'needs_client_trust': {
				// Yangi qurilmadan kirilganda Clerk emailga qo'shimcha kod yuboradi
				const { error } = await signIn.mfa.sendEmailCode()
				if (error) return setLocalError(translateError(error))
				setStep('client-trust')
				return
			}
			case 'needs_second_factor':
				setLocalError("Akkauntingizda ikki bosqichli himoya yoqilgan — bu usul hozircha qo'llab-quvvatlanmaydi")
				return
			default:
				setLocalError("Kirishni yakunlab bo'lmadi. Qaytadan urinib ko'ring")
		}
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLocalError(undefined)

		const { error } = await signIn.password({ identifier: identifier.trim(), password })
		if (error) return
		await proceed()
	}

	const verifyTrust = async (code: string) => {
		setLocalError(undefined)
		const { error } = await signIn.mfa.verifyEmailCode({ code })
		if (error) return
		await proceed()
	}

	const startOver = async () => {
		await signIn.reset()
		setPassword('')
		setLocalError(undefined)
		setStep('credentials')
	}

	if (step === 'client-trust') {
		const emailFactor = signIn.supportedSecondFactors.find(
			factor => factor.strategy === 'email_code'
		)

		return (
			<CodeStep
				title='Bu sizmisiz?'
				description={
					<>
						Yangi qurilmadan kiryapsiz. Xavfsizlik uchun{' '}
						<span className='font-medium text-foreground'>
							{emailFactor && 'safeIdentifier' in emailFactor
								? emailFactor.safeIdentifier
								: 'emailingiz'}
						</span>{' '}
						manziliga kod yubordik.
					</>
				}
				error={translateError(errors.fields.code) ?? formError}
				loading={loading}
				onVerify={verifyTrust}
				onResend={() => signIn.mfa.sendEmailCode().then(() => undefined)}
				onBack={startOver}
			/>
		)
	}

	return (
		<AuthCard
			title='Qaytganingizdan xursandmiz'
			description='Buyurtmalaringiz, savatingiz va saqlangan mahsulotlaringiz sizni kutmoqda.'
			footer={
				<>
					Akkauntingiz yo&apos;qmi?{' '}
					<Link
						href={withRedirect('/sign-up')}
						className='font-medium text-foreground underline-offset-4 hover:underline'
					>
						Ro&apos;yxatdan o&apos;tish
					</Link>
				</>
			}
		>
			<OAuthButtons onError={setLocalError} />

			<form onSubmit={handleSubmit} noValidate className='space-y-4'>
				<FormField
					id={`${uid}-identifier`}
					label='Email yoki username'
					error={translateError(errors.fields.identifier)}
				>
					<Input
						id={`${uid}-identifier`}
						autoComplete='username'
						autoFocus
						value={identifier}
						onChange={event => setIdentifier(event.target.value)}
						placeholder='siz@example.com'
						aria-invalid={Boolean(errors.fields.identifier)}
						className='h-10'
						required
					/>
				</FormField>

				<FormField
					id={`${uid}-password`}
					label='Parol'
					error={translateError(errors.fields.password)}
					action={
						<Link
							href='/forgot-password'
							className='text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'
						>
							Parolni unutdingizmi?
						</Link>
					}
				>
					<PasswordInput
						id={`${uid}-password`}
						autoComplete='current-password'
						value={password}
						onChange={event => setPassword(event.target.value)}
						aria-invalid={Boolean(errors.fields.password)}
						required
					/>
				</FormField>

				<FormAlert message={formError} />

				<SubmitButton loading={loading}>Kirish</SubmitButton>
			</form>
		</AuthCard>
	)
}

export default SignInForm
