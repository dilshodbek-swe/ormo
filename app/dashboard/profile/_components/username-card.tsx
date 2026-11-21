'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { type FormEvent, useId, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SaveButton from '../../_components/save-button'
import SettingsCard from '../../_components/settings-card'
import { useSave } from '../../_lib/use-save'

/** Username — kirishda email o'rniga ham ishlatiladi */
const UsernameCard = ({ user }: { user: UserResource }) => {
	const uid = useId()
	const [username, setUsername] = useState(user.username ?? '')
	const { state, error, run } = useSave()

	const value = username.trim()
	const dirty = value !== (user.username ?? '')

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		run(() => user.update({ username: value }))
	}

	return (
		<SettingsCard
			title='Username'
			description='Tizimga kirishda email o‘rniga shu nomdan ham foydalanishingiz mumkin.'
			onSubmit={submit}
			hint='4–64 belgi: lotin harflari, raqamlar, "-" va "_"'
			action={<SaveButton state={state} disabled={!dirty || value.length < 4} />}
		>
			<div className='max-w-sm space-y-2'>
				<Label htmlFor={`${uid}-username`} className='sr-only'>
					Username
				</Label>
				{/* Vercel uslubidagi prefiksli maydon */}
				<div className='flex h-10 overflow-hidden rounded-lg border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50'>
					<span className='flex items-center border-r bg-muted/50 px-3 font-mono text-sm text-muted-foreground'>
						ormo.uz/@
					</span>
					<Input
						id={`${uid}-username`}
						autoComplete='username'
						maxLength={64}
						value={username}
						onChange={event => setUsername(event.target.value)}
						aria-invalid={Boolean(error)}
						className='h-full rounded-none border-0 focus-visible:ring-0'
					/>
				</div>
			</div>
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default UsernameCard
