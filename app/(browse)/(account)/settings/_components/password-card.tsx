'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { type FormEvent, useId, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import FormField from '@/components/shared/form-field'
import PasswordInput from '@/components/shared/password-input'
import PasswordMeter from '@/components/shared/password-meter'
import { Label } from '@/components/ui/label'
import { PASSWORD_MIN_LENGTH } from '@/lib/clerk/constants'
import SaveButton from '../../_components/save-button'
import SettingsCard from '../../_components/settings-card'
import { useSave } from '../../_lib/use-save'

/**
 * Parolni o'zgartirish. Google/GitHub orqali ro'yxatdan o'tganlarda parol yo'q —
 * ular uchun "parol o'rnatish" rejimi (joriy parol so'ralmaydi).
 */
const PasswordCard = ({ user }: { user: UserResource }) => {
	const uid = useId()
	const hasPassword = user.passwordEnabled
	const [current, setCurrent] = useState('')
	const [next, setNext] = useState('')
	const [signOutOthers, setSignOutOthers] = useState(true)
	const { state, error, run } = useSave()

	const ready = next.length >= PASSWORD_MIN_LENGTH && (!hasPassword || current.length > 0)

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const ok = await run(() =>
			user.updatePassword({
				newPassword: next,
				currentPassword: hasPassword ? current : undefined,
				signOutOfOtherSessions: signOutOthers,
			})
		)
		if (ok) {
			setCurrent('')
			setNext('')
		}
	}

	return (
		<SettingsCard
			title={hasPassword ? 'Parol' : "Parol o'rnatish"}
			description={
				hasPassword
					? 'Parolni muntazam yangilab turish akkauntingizni xavfsizroq qiladi.'
					: 'Siz Google yoki GitHub orqali kirgansiz. Parol o‘rnatsangiz, email bilan ham kira olasiz.'
			}
			onSubmit={submit}
			hint={`Kamida ${PASSWORD_MIN_LENGTH} ta belgi`}
			action={<SaveButton state={state} disabled={!ready}>{hasPassword ? 'Yangilash' : "O'rnatish"}</SaveButton>}
		>
			<div className='max-w-sm space-y-4'>
				{hasPassword && (
					<FormField id={`${uid}-current`} label='Joriy parol'>
						<PasswordInput
							id={`${uid}-current`}
							autoComplete='current-password'
							value={current}
							onChange={event => setCurrent(event.target.value)}
						/>
					</FormField>
				)}
				<FormField id={`${uid}-new`} label='Yangi parol' hint={next && <PasswordMeter value={next} />}>
					<PasswordInput
						id={`${uid}-new`}
						autoComplete='new-password'
						value={next}
						onChange={event => setNext(event.target.value)}
					/>
				</FormField>
				<div className='flex items-center gap-2.5'>
					<input
						id={`${uid}-others`}
						type='checkbox'
						checked={signOutOthers}
						onChange={event => setSignOutOthers(event.target.checked)}
						className='size-4 accent-foreground'
					/>
					<Label htmlFor={`${uid}-others`} className='font-normal text-muted-foreground'>
						Boshqa qurilmalardan chiqish
					</Label>
				</div>
			</div>
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default PasswordCard
