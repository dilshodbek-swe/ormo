'use client'

import type { UserResource } from '@clerk/nextjs/types'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'

import { getInitials } from '@/components/shared/user-avatar'
import { errorMessage } from '@/lib/clerk/errors'

const MAX_SIZE = 10 * 1024 * 1024

/** Katta avatar: ustiga bosilsa rasm tanlanadi, yuklanayotganda halqa aylanadi */
const AvatarUploader = ({ user, onError }: { user: UserResource; onError: (message?: string) => void }) => {
	const input = useRef<HTMLInputElement>(null)
	const [busy, setBusy] = useState(false)
	const [preview, setPreview] = useState<string>()

	const upload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return
		if (file.size > MAX_SIZE) return onError('Rasm hajmi 10 MB dan oshmasin')

		onError(undefined)
		setPreview(URL.createObjectURL(file))
		setBusy(true)
		try {
			await user.setProfileImage({ file })
		} catch (error) {
			onError(errorMessage(error))
		} finally {
			setBusy(false)
			setPreview(undefined)
		}
	}

	const remove = async () => {
		onError(undefined)
		setBusy(true)
		try {
			await user.setProfileImage({ file: null })
		} catch (error) {
			onError(errorMessage(error))
		} finally {
			setBusy(false)
		}
	}

	const src = preview ?? (user.hasImage ? user.imageUrl : undefined)

	return (
		<div className='flex flex-col items-center gap-2'>
			<button
				type='button'
				onClick={() => input.current?.click()}
				disabled={busy}
				aria-label="Profil rasmini o'zgartirish"
				className='group relative size-24 shrink-0 overflow-hidden rounded-full bg-foreground text-background ring-4 ring-background outline-none focus-visible:ring-ring/50 sm:size-28'
			>
				{src ? (
					// eslint-disable-next-line @next/next/no-img-element -- Clerk CDN va lokal blob URL
					<img src={src} alt='' className='size-full object-cover' />
				) : (
					<span className='font-space-grotesk text-3xl font-bold'>{getInitials(user)}</span>
				)}
				<span className='absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
					<Camera className='size-5' />
				</span>
				{busy && (
					<span className='absolute inset-0 flex items-center justify-center bg-black/50 text-white'>
						<Loader2 className='size-5 animate-spin' />
					</span>
				)}
			</button>

			{user.hasImage && !busy && (
				<button
					type='button'
					onClick={remove}
					className='inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive'
				>
					<Trash2 className='size-3' />
					Olib tashlash
				</button>
			)}

			<input ref={input} type='file' accept='image/png,image/jpeg,image/webp,image/gif' hidden onChange={upload} />
		</div>
	)
}

export default AvatarUploader
