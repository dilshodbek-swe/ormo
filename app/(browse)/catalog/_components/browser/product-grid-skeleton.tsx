const ProductGridSkeleton = () => {
	return (
		<div className='overflow-hidden rounded-xl border bg-background'>
			<div className='-mr-px -mb-px grid grid-cols-2 *:border-r *:border-b md:grid-cols-3 lg:grid-cols-4'>
				{Array.from({ length: 8 }, (_, index) => (
					<div key={index} className='aspect-3/4 animate-pulse bg-muted/50' />
				))}
			</div>
		</div>
	)
}

export default ProductGridSkeleton
