'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { type FormEvent, useId, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import FormField from '@/components/shared/form-field'
import { Input } from '@/components/ui/input'
import SaveButton from '../../_components/save-button'
import SettingsCard from '../../_components/settings-card'
import { useSave } from '../../_lib/use-save'

/** Ism va familiya — buyurtma va yetkazib berishda ko'rinadi */
const PersonalInfoCard = ({ user }: { user: UserResource }) => {
	const uid = useId()
	const [firstName, setFirstName] = useState(user.firstName ?? '')
	const [lastName, setLastName] = useState(user.lastName ?? '')
	const { state, error, run } = useSave()

	const dirty = firstName.trim() !== (user.firstName ?? '') || lastName.trim() !== (user.lastName ?? '')

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		run(() => user.update({ firstName: firstName.trim(), lastName: lastName.trim() }))
	}

	return (
		<SettingsCard
			title='Ism va familiya'
			description='Buyurtmalarni rasmiylashtirish va yetkazib berishda shu ism ishlatiladi.'
			onSubmit={submit}
			hint='Har biri 64 belgigacha'
			action={<SaveButton state={state} disabled={!dirty} />}
		>
			<div className='grid max-w-lg gap-4 sm:grid-cols-2'>
				<FormField id={`${uid}-first`} label='Ism'>
					<Input
						id={`${uid}-first`}
						autoComplete='given-name'
						maxLength={64}
						value={firstName}
						onChange={event => setFirstName(event.target.value)}
						placeholder='Aziz'
						className='h-10'
					/>
				</FormField>
				<FormField id={`${uid}-last`} label='Familiya'>
					<Input
						id={`${uid}-last`}
						autoComplete='family-name'
						maxLength={64}
						value={lastName}
						onChange={event => setLastName(event.target.value)}
						placeholder='Karimov'
						className='h-10'
					/>
				</FormField>
			</div>
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default PersonalInfoCard
