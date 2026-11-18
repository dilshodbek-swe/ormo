import { PackageSearch } from 'lucide-react'

import { Button } from '@/components/ui/button'

const ShopEmpty = ({ onReset }: { onReset: () => void }) => {
	return (
		<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center'>
			<PackageSearch className='size-8 text-muted-foreground' />
			<div className='space-y-1'>
				<p className='font-medium'>Hech narsa topilmadi</p>
				<p className='text-sm text-muted-foreground'>
					Filtrlarni o&apos;zgartirib yoki tozalab ko&apos;ring.
				</p>
			</div>
			<Button variant='outline' size='sm' onClick={onReset}>
				Filtrlarni tozalash
			</Button>
		</div>
	)
}

export default ShopEmpty
