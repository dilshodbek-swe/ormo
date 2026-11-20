import { ShieldCheck } from 'lucide-react'

import GridFrame from '@/components/shared/grid-frame'

/** Barcha auth sahifalari uchun umumiy sahna: nuqtali fon va markazdagi Vercel uslubidagi ramka */
const AuthLayout = ({ children }: LayoutProps<'/'>) => {
	return (
		<section className='relative isolate overflow-hidden'>
			{/* Chetlarga qarab so'nib boruvchi nuqtali to'r */}
			<div
				aria-hidden
				className='absolute inset-0 -z-10 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[20px_20px]'
			/>

			<div className='mx-auto flex min-h-[calc(100svh-4rem)] max-w-110 flex-col justify-center px-4 py-12 sm:py-20'>
				<GridFrame className='bg-background shadow-[0_1px_0_0_var(--color-border),0_24px_48px_-24px_rgb(0_0_0/0.12)]'>
					{children}
				</GridFrame>

				<p className='mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
					<ShieldCheck className='size-3.5' />
					Ma&apos;lumotlaringiz shifrlangan ulanish orqali himoyalanadi
				</p>
			</div>
		</section>
	)
}

export default AuthLayout
