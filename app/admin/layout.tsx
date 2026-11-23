import type { Metadata } from 'next'
import { type ReactNode, Suspense } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { requireAdmin } from '@/lib/auth/require-admin'
import AdminNavbar from './_components/admin-navbar'
import AdminShellSkeleton from './_components/admin-shell-skeleton'
import AdminSidebar from './_components/admin-sidebar'

export const metadata: Metadata = {
	title: { template: '%s — Ormo Admin', default: 'Admin — Ormo' },
	robots: { index: false, follow: false },
}

/**
 * Rol tekshiruvi: admin bo'lmasa forbidden() — sidebar ham, sahifa ham render bo'lmaydi.
 * Tekshiruv bazaga murojaat qiladi, shuning uchun Suspense ichida (cacheComponents).
 */
const AdminGuard = async ({ children }: { children: ReactNode }) => {
	await requireAdmin()
	return children
}

/** Admin karkasi: chapda yig'iladigan sidebar, tepada navbar. Kirish — proxy.ts, rol — AdminGuard. */
const AdminLayout = ({ children }: LayoutProps<'/admin'>) => {
	return (
		<Suspense fallback={<AdminShellSkeleton />}>
			<AdminGuard>
				<TooltipProvider>
					<SidebarProvider>
						<AdminSidebar />
						<SidebarInset className='min-w-0'>
							<AdminNavbar />
							<div className='relative flex-1'>
								{/* Chizg'ichli to'r fon — dashboard'dagi nuqtalardan farqli, pastga qarab so'nadi */}
								<div
									aria-hidden
									className='pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-70'
								/>
								<div className='relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8'>
									{children}
								</div>
							</div>
						</SidebarInset>
					</SidebarProvider>
				</TooltipProvider>
			</AdminGuard>
		</Suspense>
	)
}

export default AdminLayout
