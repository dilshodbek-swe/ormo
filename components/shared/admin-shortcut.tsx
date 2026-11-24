import { Suspense } from 'react'

import { getAdminState } from '@/lib/auth/get-admin-state'
import AdminButton from './admin-button'

const AdminShortcutInner = async ({ className }: { className?: string }) => {
	const { userId, isAdmin } = await getAdminState()
	return <AdminButton serverUserId={userId} isAdmin={isAdmin} className={className} />
}

/**
 * Header'dagi "Admin" tugmasi (Server Component). Rol bazadan o'qiladi, shuning uchun
 * Suspense ichida — sahifaning qolgan qismi kutib turmaydi, tugma tayyor bo'lganda paydo bo'ladi.
 */
const AdminShortcut = ({ className }: { className?: string }) => (
	<Suspense fallback={null}>
		<AdminShortcutInner className={className} />
	</Suspense>
)

export default AdminShortcut
