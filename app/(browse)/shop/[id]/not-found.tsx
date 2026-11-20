import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'

const ProductNotFound = () => {
	return (
		<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
			<GridFrame className='flex flex-col items-center gap-6 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[18px_18px] px-6 py-24 text-center'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					404 · Topilmadi
				</p>
				<h1 className='font-space-grotesk text-4xl font-bold tracking-tighter text-balance sm:text-5xl'>
					Bunday mahsulot yo&apos;q.
				</h1>
				<p className='max-w-md text-muted-foreground'>
					Havola eskirgan yoki mahsulot sotuvdan olingan bo&apos;lishi mumkin.
				</p>
				<Button
					size='lg'
					className='h-11 px-5'
					nativeButton={false}
					render={<Link href='/shop' />}
				>
					<ArrowLeft />
					Do&apos;konga qaytish
				</Button>
			</GridFrame>
		</div>
	)
}

export default ProductNotFound
