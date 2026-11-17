import { PackageSearch } from 'lucide-react'

const EmptyState = () => {
	return (
		<div className='flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center'>
			<PackageSearch className='size-8 text-muted-foreground' />
			<p className='font-medium'>Bu bo&apos;limda hozircha mahsulot yo&apos;q</p>
		</div>
	)
}

export default EmptyState
