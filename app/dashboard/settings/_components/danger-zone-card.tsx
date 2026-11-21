'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useId, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { errorMessage } from '@/lib/clerk/errors'
import SettingsCard from '../../_components/settings-card'

/** Akkauntni butunlay o'chirish — tasdiqlash uchun username (yoki email) yoziladi */
const DangerZoneCard = ({ user }: { user: UserResource }) => {
	const uid = useId()
	const router = useRouter()
	const [confirming, setConfirming] = useState(false)
	const [value, setValue] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState<string>()

	const phrase = user.username ?? user.primaryEmailAddress?.emailAddress ?? 'o‘chirish'
	const matches = value.trim() === phrase

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!matches) return
		setBusy(true)
		setError(undefined)
		try {
			await user.delete()
			router.replace('/')
		} catch (caught) {
			setError(errorMessage(caught))
			setBusy(false)
		}
	}

	return (
		<SettingsCard
			tone='danger'
			title="Akkauntni o'chirish"
			description="Profil, buyurtmalar tarixi va barcha sozlamalar butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi."
			onSubmit={confirming ? submit : undefined}
			hint={confirming ? 'Tasdiqlash uchun maydonni to‘ldiring' : undefined}
			action={
				confirming ? (
					<>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								setConfirming(false)
								setValue('')
							}}
						>
							Bekor qilish
						</Button>
						<Button type='submit' variant='destructive' disabled={!matches || busy}>
							{busy && <Loader2 className='animate-spin' />}
							Butunlay o&apos;chirish
						</Button>
					</>
				) : (
					<Button type='button' variant='destructive' onClick={() => setConfirming(true)}>
						Akkauntni o&apos;chirish
					</Button>
				)
			}
		>
			{confirming && (
				<div className='animate-in fade-in slide-in-from-top-1 max-w-sm space-y-3'>
					<p className='flex gap-2 text-sm'>
						<TriangleAlert className='mt-0.5 size-4 shrink-0 text-destructive' />
						<span>
							Davom etish uchun{' '}
							<code className='rounded bg-muted px-1.5 py-0.5 font-mono text-xs'>{phrase}</code> deb yozing.
						</span>
					</p>
					<Label htmlFor={`${uid}-confirm`} className='sr-only'>
						Tasdiqlash
					</Label>
					<Input
						id={`${uid}-confirm`}
						autoFocus
						autoComplete='off'
						value={value}
						onChange={event => setValue(event.target.value)}
						className='h-10'
					/>
					<FormAlert message={error} />
				</div>
			)}
		</SettingsCard>
	)
}

export default DangerZoneCard
