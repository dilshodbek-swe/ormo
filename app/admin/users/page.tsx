import type { Metadata } from 'next'
import { Suspense } from 'react'

import UsersView from './_components/users-view'
import { getAdminUsers } from './_lib/queries'

export const metadata: Metadata = { title: 'Foydalanuvchilar' }

/** Bazadan o'qish so'rov vaqtida — karkas (skelet) darhol ko'rinadi */
const UsersLoader = async () => {
	const { users, currentId } = await getAdminUsers()
	return <UsersView users={users} currentId={currentId} />
}

const UsersSkeleton = () => (
	<div aria-hidden className='space-y-6'>
		<div className='space-y-3'>
			<div className='h-3 w-40 animate-pulse rounded bg-muted' />
			<div className='h-12 w-80 max-w-full animate-pulse rounded bg-muted' />
		</div>
		<div className='h-28 animate-pulse rounded-xl border bg-muted/30' />
		<div className='space-y-px overflow-hidden rounded-xl border'>
			{[0, 1, 2, 3].map(index => (
				<div key={index} className='h-16 animate-pulse bg-muted/30' />
			))}
		</div>
	</div>
)

const AdminUsersPage = () => (
	<Suspense fallback={<UsersSkeleton />}>
		<UsersLoader />
	</Suspense>
)

export default AdminUsersPage
