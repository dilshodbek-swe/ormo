'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

interface AdminButtonProps {
	/** Server qaysi foydalanuvchi uchun hisoblagan */
	serverUserId: string | null
	isAdmin: boolean
	className?: string
}

/**
 * "Admin panel" tugmasi — faqat admin roli borlarga.
 * Layout client navigatsiyada qayta render bo'lmaydi, shuning uchun Clerk'dagi foydalanuvchi
 * server hisoblaganidan farq qilsa (kirdi/chiqdi/almashdi), server qismini yangilab olamiz.
 */
const AdminButton = ({ serverUserId, isAdmin, className }: AdminButtonProps) => {
	const { isLoaded, userId } = useAuth()
	const router = useRouter()
	const refreshedFor = useRef<string | null | undefined>(undefined)

	const current = userId ?? null
	const stale = isLoaded && current !== serverUserId

	useEffect(() => {
		if (!stale || refreshedFor.current === current) return
		refreshedFor.current = current
		router.refresh()
	}, [stale, current, router])

	if (!isLoaded || stale || !isAdmin) return null

	return (
		<Link
			href='/admin'
			title="Admin panelni ochish"
			className={cn(
				'group inline-flex h-8 items-center gap-2 rounded-full border bg-background px-2.5 text-xs font-medium transition-colors hover:border-foreground/30 hover:bg-muted sm:px-3',
				className
			)}
		>
			<span className='size-2.5 shrink-0 rotate-45 rounded-[2px] bg-foreground transition-transform duration-500 group-hover:rotate-[225deg]' />
			<span className='hidden sm:inline'>Admin</span>
			<span className='sr-only sm:hidden'>Admin panel</span>
		</Link>
	)
}

export default AdminButton
