import ProductGridSkeleton from '@/components/shared/product-grid-skeleton'
import { SHOP_GRID_COLUMNS } from './results/shop-results'

/** useSearchParams yuklanguncha ko'rinadigan joy egallovchi */
const ShopSkeleton = () => {
	return (
		<div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
			<div className='hidden h-[36rem] w-72 shrink-0 animate-pulse rounded-xl border bg-muted/50 lg:block' />
			<div className='min-w-0 flex-1 space-y-4'>
				<div className='h-8' />
				<ProductGridSkeleton count={6} gridClassName={SHOP_GRID_COLUMNS} />
			</div>
		</div>
	)
}

export default ShopSkeleton
