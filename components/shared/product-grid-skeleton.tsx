import ProductGrid from './product-grid'

interface ProductGridSkeletonProps {
	count?: number
	gridClassName?: string
}

const ProductGridSkeleton = ({ count = 8, gridClassName }: ProductGridSkeletonProps) => {
	return (
		<ProductGrid gridClassName={gridClassName}>
			{Array.from({ length: count }, (_, index) => (
				<div key={index} className='aspect-3/4 animate-pulse bg-muted/50' />
			))}
		</ProductGrid>
	)
}

export default ProductGridSkeleton
