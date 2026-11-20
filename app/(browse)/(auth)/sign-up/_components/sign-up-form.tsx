'use client'

import { useSignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { type FormEvent, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import AuthCard from '../../_components/auth-card'
import CodeStep from '../../_components/code-step'
import FormAlert from '../../_components/form-alert'
import FormField from '../../_components/form-field'
import OAuthButtons from '../../_components/oauth-buttons'
import PasswordInput from '../../_components/password-input'
import PasswordMeter from '../../_components/password-meter'
import SubmitButton from '../../_components/submit-button'
import { globalError, translateError } from '../../_lib/auth-errors'
import { useAuthRedirect } from '../../_lib/use-auth-redirect'
import { useRedirectIfSignedIn } from '../../_lib/use-redirect-if-signed-in'

const SignUpForm = () => {
	const { signUp, errors, fetchStatus } = useSignUp()
	const uid = useId()
	const { navigate, withRedirect } = useAuthRedirect()
	useRedirectIfSignedIn()

	const [step, setStep] = useState<'details' | 'verify'>('details')
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		username: '',
		emailAddress: '',
		password: '',
	})
	const [localError, setLocalError] = useState<string>()

	const loading = fetchStatus === 'fetching'
	const formError = localError ?? globalError(errors)
	const fieldError = (name: keyof typeof errors.fields) => translateError(errors.fields[name])

	const update =
		(name: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
			setForm(prev => ({ ...prev, [name]: event.target.value }))

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLocalError(undefined)

		const { error } = await signUp.password({
			firstName: form.firstName.trim() || undefined,
			lastName: form.lastName.trim() || undefined,
			username: form.username.trim(),
			emailAddress: form.emailAddress.trim(),
			password: form.password,
		})
		if (error) return

		const { error: sendError } = await signUp.verifications.sendEmailCode()
		if (sendError) return setLocalError(translateError(sendError))
		setStep('verify')
	}

	const verify = async (code: string) => {
		setLocalError(undefined)
		const { error } = await signUp.verifications.verifyEmailCode({ code })
		if (error) return

		if (signUp.status === 'complete') {
			const { error: finalizeError } = await signUp.finalize({ navigate })
			if (finalizeError) setLocalError(translateError(finalizeError))
			return
		}
		setLocalError("Ro'yxatdan o'tishni yakunlab bo'lmadi. Qaytadan urinib ko'ring")
	}

	if (step === 'verify') {
		return (
			<CodeStep
				title='Emailingizni tasdiqlang'
				destination={form.emailAddress}
				error={fieldError('code') ?? formError}
				loading={loading}
				submitLabel='Akkauntni yaratish'
				onVerify={verify}
				onResend={() => signUp.verifications.sendEmailCode().then(() => undefined)}
				onBack={() => {
					setLocalError(undefined)
					setStep('details')
				}}
			/>
		)
	}

	return (
		<AuthCard
			title='Ormo akkauntini yarating'
			description='Buyurtmalarni kuzating, savatni saqlang va maxsus takliflardan birinchi bo‘lib xabardor bo‘ling.'
			footer={
				<>
					Akkauntingiz bormi?{' '}
					<Link
						href={withRedirect('/sign-in')}
						className='font-medium text-foreground underline-offset-4 hover:underline'
					>
						Kirish
					</Link>
				</>
			}
		>
			<OAuthButtons onError={setLocalError} />

			<form onSubmit={handleSubmit} noValidate className='space-y-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					<FormField id={`${uid}-firstName`} label='Ism' error={fieldError('firstName')}>
						<Input
							id={`${uid}-firstName`}
							autoComplete='given-name'
							autoFocus
							value={form.firstName}
							onChange={update('firstName')}
							placeholder='Aziz'
							aria-invalid={Boolean(errors.fields.firstName)}
							className='h-10'
						/>
					</FormField>
					<FormField id={`${uid}-lastName`} label='Familiya' error={fieldError('lastName')}>
						<Input
							id={`${uid}-lastName`}
							autoComplete='family-name'
							value={form.lastName}
							onChange={update('lastName')}
							placeholder='Karimov'
							aria-invalid={Boolean(errors.fields.lastName)}
							className='h-10'
						/>
					</FormField>
				</div>

				<FormField id={`${uid}-username`} label='Username' error={fieldError('username')}>
					<div className='relative'>
						<span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground'>
							@
						</span>
						<Input
							id={`${uid}-username`}
							autoComplete='username'
							value={form.username}
							onChange={update('username')}
							placeholder='aziz_karimov'
							aria-invalid={Boolean(errors.fields.username)}
							className='h-10 pl-7'
							required
						/>
					</div>
				</FormField>

				<FormField id={`${uid}-emailAddress`} label='Email' error={fieldError('emailAddress')}>
					<Input
						id={`${uid}-emailAddress`}
						type='email'
						autoComplete='email'
						value={form.emailAddress}
						onChange={update('emailAddress')}
						placeholder='siz@example.com'
						aria-invalid={Boolean(errors.fields.emailAddress)}
						className='h-10'
						required
					/>
				</FormField>

				<FormField
					id={`${uid}-password`}
					label='Parol'
					error={fieldError('password')}
					hint={<PasswordMeter value={form.password} />}
				>
					<PasswordInput
						id={`${uid}-password`}
						autoComplete='new-password'
						value={form.password}
						onChange={update('password')}
						aria-invalid={Boolean(errors.fields.password)}
						required
					/>
				</FormField>

				<FormAlert message={formError} />

				{/* Clerk bot himoyasi (yoqilgan bo'lsa) shu yerga widget joylaydi */}
				<div id='clerk-captcha' />

				<SubmitButton loading={loading}>Davom etish</SubmitButton>

				<p className='text-center text-xs leading-relaxed text-muted-foreground'>
					Davom etish orqali siz{' '}
					<Link href='/terms' className='underline underline-offset-4 hover:text-foreground'>
						foydalanish shartlari
					</Link>{' '}
					va{' '}
					<Link href='/privacy' className='underline underline-offset-4 hover:text-foreground'>
						maxfiylik siyosati
					</Link>
					ga rozilik bildirasiz.
				</p>
			</form>
		</AuthCard>
	)
}

export default SignUpForm
