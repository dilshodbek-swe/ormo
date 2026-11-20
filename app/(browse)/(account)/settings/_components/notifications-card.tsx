'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { Loader2 } from 'lucide-react'
import { useId, useState } from 'react'

import FormAlert from '@/components/shared/form-alert'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { errorMessage } from '@/lib/clerk/errors'
import SettingsCard from '../../_components/settings-card'

type Channel = 'orders' | 'deals' | 'news'

const channels: { key: Channel; title: string; description: string }[] = [
	{ key: 'orders', title: 'Buyurtma holati', description: "Qadoqlash, jo'natish va yetkazib berish haqida xabarlar" },
	{ key: 'deals', title: 'Chegirmalar', description: 'Shaxsiy takliflar va kunning chegirmalari' },
	{ key: 'news', title: 'Yangi mahsulotlar', description: "Do'konga yangi texnika kelganda xabar beramiz" },
]

const defaults: Record<Channel, boolean> = { orders: true, deals: false, news: false }

/**
 * Bildirishnoma sozlamalari Clerk'dagi `unsafeMetadata` da saqlanadi —
 * alohida backend kerak emas, har qurilmada bir xil.
 */
const NotificationsCard = ({ user }: { user: UserResource }) => {
	const uid = useId()
	const saved = (user.unsafeMetadata.notifications ?? {}) as Partial<Record<Channel, boolean>>
	const [prefs, setPrefs] = useState({ ...defaults, ...saved })
	const [pending, setPending] = useState<Channel | null>(null)
	const [error, setError] = useState<string>()

	// Darhol o'zgartiramiz (optimistik), xato bo'lsa — qaytaramiz
	const toggle = async (key: Channel, value: boolean) => {
		const previous = prefs
		const next = { ...prefs, [key]: value }
		setPrefs(next)
		setPending(key)
		setError(undefined)
		try {
			await user.update({ unsafeMetadata: { ...user.unsafeMetadata, notifications: next } })
		} catch (caught) {
			setPrefs(previous)
			setError(errorMessage(caught))
		} finally {
			setPending(null)
		}
	}

	return (
		<SettingsCard
			title='Bildirishnomalar'
			description={`Xabarlar ${user.primaryEmailAddress?.emailAddress ?? 'emailingiz'} manziliga yuboriladi.`}
			hint='O‘zgarishlar avtomatik saqlanadi'
		>
			<ul className='divide-y border'>
				{channels.map(({ key, title, description }) => (
					<li key={key} className='flex items-center gap-4 px-4 py-3'>
						<div className='min-w-0 flex-1'>
							<Label htmlFor={`${uid}-${key}`} className='text-sm font-medium'>
								{title}
							</Label>
							<p className='text-xs text-muted-foreground'>{description}</p>
						</div>
						{pending === key && <Loader2 className='size-3.5 animate-spin text-muted-foreground' />}
						<Switch
							id={`${uid}-${key}`}
							checked={prefs[key]}
							disabled={pending !== null}
							onCheckedChange={value => toggle(key, value)}
						/>
					</li>
				))}
			</ul>
			<FormAlert message={error} />
		</SettingsCard>
	)
}

export default NotificationsCard
