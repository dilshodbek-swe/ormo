'use client'

import { useSignIn } from '@clerk/nextjs'
import { KeyRound, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthCard from '../../_components/auth-card'
import CodeStep from '../../_components/code-step'
import FormAlert from '../../_components/form-alert'
import FormField from '../../_components/form-field'
import PasswordInput from '../../_components/password-input'
import PasswordMeter from '../../_components/password-meter'
import SubmitButton from '../../_components/submit-button'
import { globalError, translateError } from '../../_lib/auth-errors'
import { useAuthRedirect } from '../../_lib/use-auth-redirect'

type Step = 'email' | 'code' | 'password'

const steps: Step[] = ['email', 'code', 'password']

/** 3 bosqichli parol tiklash: email → kod → yangi parol */
const ForgotPasswordForm = () => {
	const { signIn, errors, fetchStatus } = useSignIn()
	const uid = useId()
	const { navigate } = useAuthRedirect()

	const [step, setStep] = useState<Step>('email')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [signOutOthers, setSignOutOthers] = useState(true)
	const [localError, setLocalError] = useState<string>()

	const loading = fetchStatus === 'fetching'
	const formError = localError ?? globalError(errors)

	const sendCode = async () => {
		const { error } = await signIn.resetPasswordEmailCode.sendCode()
		if (error) setLocalError(translateError(error))
		return !error
	}

	const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLocalError(undefined)

		const { error } = await signIn.create({ identifier: email.trim() })
		if (error) return
		if (await sendCode()) setStep('code')
	}

	const verifyCode = async (code: string) => {
		setLocalError(undefined)
		const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code })
		if (error) return
		if (signIn.status === 'needs_new_password') setStep('password')
	}

	const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLocalError(undefined)

		const { error } = await signIn.resetPasswordEmailCode.submitPassword({
			password,
			signOutOfOtherSessions: signOutOthers,
		})
		if (error) return

		if (signIn.status === 'complete') {
			const { error: finalizeError } = await signIn.finalize({ navigate })
			if (finalizeError) setLocalError(translateError(finalizeError))
			return
		}
		setLocalError(
			signIn.status === 'needs_second_factor'
				? "Parol yangilandi, lekin akkauntda ikki bosqichli himoya yoqilgan — hozircha qo'llab-quvvatlanmaydi"
				: "Parolni yangilab bo'lmadi. Qaytadan urinib ko'ring"
		)
	}

	const progress = (
		<div className='flex gap-1.5' aria-label={`${steps.indexOf(step) + 1}-qadam, jami 3`}>
			{steps.map((item, index) => (
				<span
					key={item}
					className={
						index <= steps.indexOf(step)
							? 'h-1 flex-1 rounded-full bg-foreground transition-colors'
							: 'h-1 flex-1 rounded-full bg-muted transition-colors'
					}
				/>
			))}
		</div>
	)

	const backToSignIn = (
		<Link href='/sign-in' className='font-medium text-foreground underline-offset-4 hover:underline'>
			Kirish sahifasiga qaytish
		</Link>
	)

	if (step === 'code') {
		return (
			<CodeStep
				title='Kodni kiriting'
				destination={email}
				error={translateError(errors.fields.code) ?? formError}
				loading={loading}
				submitLabel='Davom etish'
				onVerify={verifyCode}
				onResend={() => sendCode().then(() => undefined)}
				onBack={() => {
					setLocalError(undefined)
					setStep('email')
				}}
			/>
		)
	}

	if (step === 'password') {
		return (
			<AuthCard
				icon={<LockKeyhole />}
				title='Yangi parol'
				description='Oldingisidan farq qiladigan, eslab qolish oson, ammo taxmin qilish qiyin parol tanlang.'
				footer={backToSignIn}
			>
				{progress}
				<form onSubmit={submitPassword} noValidate className='space-y-4'>
					<FormField
						id={`${uid}-password`}
						label='Yangi parol'
						error={translateError(errors.fields.password)}
						hint={<PasswordMeter value={password} />}
					>
						<PasswordInput
							id={`${uid}-password`}
							autoComplete='new-password'
							autoFocus
							value={password}
							onChange={event => setPassword(event.target.value)}
							aria-invalid={Boolean(errors.fields.password)}
							required
						/>
					</FormField>

					<div className='flex items-center gap-2.5'>
						<input
							id={`${uid}-signOutOthers`}
							type='checkbox'
							checked={signOutOthers}
							onChange={event => setSignOutOthers(event.target.checked)}
							className='size-4 accent-foreground'
						/>
						<Label htmlFor={`${uid}-signOutOthers`} className='font-normal text-muted-foreground'>
							Boshqa qurilmalardagi sessiyalardan chiqish
						</Label>
					</div>

					<FormAlert message={formError} />

					<SubmitButton loading={loading}>Parolni yangilash</SubmitButton>
				</form>
			</AuthCard>
		)
	}

	return (
		<AuthCard
			icon={<KeyRound />}
			title='Parolni tiklash'
			description='Akkauntingizga bog‘langan emailni kiriting — tiklash kodini yuboramiz.'
			footer={backToSignIn}
		>
			{progress}
			<form onSubmit={submitEmail} noValidate className='space-y-4'>
				<FormField id={`${uid}-email`} label='Email' error={translateError(errors.fields.identifier)}>
					<Input
						id={`${uid}-email`}
						type='email'
						autoComplete='email'
						autoFocus
						value={email}
						onChange={event => setEmail(event.target.value)}
						placeholder='siz@example.com'
						aria-invalid={Boolean(errors.fields.identifier)}
						className='h-10'
						required
					/>
				</FormField>

				<FormAlert message={formError} />

				<SubmitButton loading={loading}>Kod yuborish</SubmitButton>
			</form>
		</AuthCard>
	)
}

export default ForgotPasswordForm
