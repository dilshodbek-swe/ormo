'use client'

import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { RESEND_COOLDOWN } from '@/lib/clerk/constants'
import AuthCard from './auth-card'
import FormAlert from '@/components/shared/form-alert'
import SubmitButton from './submit-button'

const CODE_LENGTH = 6

interface CodeStepProps {
	title: string
	/** Kod yuborilgan manzil */
	destination?: string | null
	description?: ReactNode
	error?: string
	loading: boolean
	submitLabel?: string
	onVerify: (code: string) => void | Promise<void>
	onResend: () => void | Promise<void>
	onBack?: () => void
}

/** Emailga yuborilgan 6 xonali kodni kiritish bosqichi */
const CodeStep = ({
	title,
	destination,
	description,
	error,
	loading,
	submitLabel = 'Tasdiqlash',
	onVerify,
	onResend,
	onBack,
}: CodeStepProps) => {
	const [code, setCode] = useState('')
	const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

	useEffect(() => {
		if (cooldown === 0) return
		const timer = setTimeout(() => setCooldown(value => value - 1), 1000)
		return () => clearTimeout(timer)
	}, [cooldown])

	// Yangi xato kelganda maydonni tozalab, qayta yozishni osonlashtiramiz
	// (render paytida oldingi qiymat bilan solishtirish — effect'siz React usuli)
	const [seenError, setSeenError] = useState(error)
	if (error !== seenError) {
		setSeenError(error)
		if (error) setCode('')
	}

	const submit = (event?: FormEvent) => {
		event?.preventDefault()
		if (code.length === CODE_LENGTH && !loading) onVerify(code)
	}

	const resend = async () => {
		setCode('')
		setCooldown(RESEND_COOLDOWN)
		await onResend()
	}

	return (
		<AuthCard
			icon={<MailCheck />}
			title={title}
			description={
				description ?? (
					<>
						{CODE_LENGTH} xonali kodni{' '}
						{destination ? (
							<span className='font-medium text-foreground'>{destination}</span>
						) : (
							'emailingiz'
						)}{' '}
						manziliga yubordik.
					</>
				)
			}
			footer={
				onBack && (
					<button
						type='button'
						onClick={onBack}
						className='inline-flex items-center gap-1.5 font-medium text-foreground hover:underline'
					>
						<ArrowLeft className='size-3.5' />
						Orqaga qaytish
					</button>
				)
			}
		>
			<form onSubmit={submit} className='space-y-6'>
				<InputOTP
					autoFocus
					maxLength={CODE_LENGTH}
					pattern={REGEXP_ONLY_DIGITS}
					value={code}
					onChange={setCode}
					onComplete={(value: string) => !loading && onVerify(value)}
					disabled={loading}
					aria-invalid={Boolean(error)}
					containerClassName='justify-center'
				>
					<InputOTPGroup className='gap-2'>
						{Array.from({ length: CODE_LENGTH }, (_, index) => (
							<InputOTPSlot
								key={index}
								index={index}
								aria-invalid={Boolean(error)}
								className='size-11 rounded-lg border font-mono text-lg first:rounded-lg last:rounded-lg'
							/>
						))}
					</InputOTPGroup>
				</InputOTP>

				<FormAlert message={error} />

				<SubmitButton loading={loading}>{submitLabel}</SubmitButton>

				<p className='text-center text-sm text-muted-foreground'>
					Kod kelmadimi?{' '}
					{cooldown > 0 ? (
						<span className='font-mono tabular-nums'>
							0:{String(cooldown).padStart(2, '0')}
						</span>
					) : (
						<Button
							type='button'
							variant='link'
							onClick={resend}
							disabled={loading}
							className='h-auto p-0 text-foreground'
						>
							{loading && <Loader2 className='animate-spin' />}
							Qayta yuborish
						</Button>
					)}
				</p>
			</form>
		</AuthCard>
	)
}

export default CodeStep
