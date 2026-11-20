import { ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import GridFrame from '@/components/shared/grid-frame'
import { Button } from '@/components/ui/button'

const CartEmpty = () => {
	return (
		<GridFrame className='flex flex-col items-center gap-6 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[18px_18px] px-6 py-20 text-center sm:py-28'>
			<span className='flex size-16 items-center justify-center rounded-full border bg-background shadow-sm'>
				<ShoppingBag className='size-6 text-muted-foreground' />
			</span>
			<div className='space-y-3'>
				<h2 className='font-space-grotesk text-3xl font-bold tracking-tighter text-balance sm:text-4xl'>
					Savat hozircha bo&apos;sh.
				</h2>
				<p className='mx-auto max-w-sm text-muted-foreground'>
					Keyingi kadringiz uchun texnika shu yerda yig&apos;iladi. Boshlash uchun do&apos;konga
					kiring.
				</p>
			</div>
			<div className='flex flex-wrap justify-center gap-2'>
				<Button
					size='lg'
					className='group h-11 px-5'
					nativeButton={false}
					render={<Link href='/shop' />}
				>
					Do&apos;konga o&apos;tish
					<ArrowRight className='transition-transform group-hover:translate-x-0.5' />
				</Button>
				<Button
					size='lg'
					variant='outline'
					className='h-11 bg-background px-5'
					nativeButton={false}
					render={<Link href='/deals' />}
				>
					Chegirmalar
				</Button>
			</div>
		</GridFrame>
	)
}

export default CartEmpty
