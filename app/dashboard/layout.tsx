import type { Metadata } from 'next'

import AdminShortcut from '@/components/shared/admin-shortcut'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import StoreHydrator from '@/lib/store/store-hydrator'
import DashboardNavbar from './_components/dashboard-navbar'
import DashboardSidebar from './_components/dashboard-sidebar'

export const metadata: Metadata = {
	title: { template: '%s — Ormo Dashboard', default: 'Dashboard — Ormo' },
	robots: { index: false },
}

/** Dashboard karkasi: chapda yig'iladigan sidebar, tepada navbar (himoya — proxy.ts da) */
const DashboardLayout = ({ children }: LayoutProps<'/dashboard'>) => {
	return (
		<TooltipProvider>
			<StoreHydrator />
			<SidebarProvider>
				<DashboardSidebar />
				<SidebarInset className='min-w-0'>
					<DashboardNavbar adminSlot={<AdminShortcut />} />
					<div className='relative flex-1'>
						{/* Nozik nuqtali fon — faqat tepada, pastga qarab so'nadi */}
						<div
							aria-hidden
							className='pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[20px_20px] mask-[linear-gradient(to_bottom,black,transparent)]'
						/>
						<div className='relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8'>
							{children}
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	)
}

export default DashboardLayout
