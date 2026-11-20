'use client'

import type { UserResource } from '@clerk/nextjs/types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

/** Ism-familiyadan (yo'q bo'lsa username/emaildan) 1–2 harfli bosh harflar */
export const getInitials = (user: UserResource) => {
	const fromName = [user.firstName, user.lastName]
		.filter(Boolean)
		.map(part => part!.charAt(0))
		.join('')
	const fallback = user.username ?? user.primaryEmailAddress?.emailAddress ?? '?'
	return (fromName || fallback.charAt(0)).toUpperCase()
}

interface UserAvatarProps {
	user: UserResource
	size?: 'sm' | 'default' | 'lg'
	className?: string
}

/** Foydalanuvchi rasmi; rasm yuklamagan bo'lsa — bosh harflar */
const UserAvatar = ({ user, size = 'default', className }: UserAvatarProps) => {
	return (
		<Avatar size={size} className={className}>
			{/* Clerk rasm yo'q bo'lsa ham standart rasm beradi — uni emas, o'zimizning fallbackni ko'rsatamiz */}
			{user.hasImage && <AvatarImage src={user.imageUrl} alt='' />}
			<AvatarFallback className='bg-foreground font-medium text-background'>
				{getInitials(user)}
			</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar
