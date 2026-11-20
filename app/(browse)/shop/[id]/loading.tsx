/** Noma'lum mahsulot so'ralganda — sahifa skeleti */
const ProductLoading = () => {
	return (
		<div className='mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 md:py-12'>
			<div className='h-4 w-48 animate-pulse rounded bg-muted' />
			<div className='grid divide-y border lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:divide-x lg:divide-y-0'>
				<div className='aspect-square animate-pulse bg-muted/50 lg:aspect-auto lg:min-h-[36rem]' />
				<div className='space-y-6 p-6 sm:p-10'>
					<div className='h-12 w-3/4 animate-pulse rounded bg-muted' />
					<div className='h-6 w-1/2 animate-pulse rounded bg-muted' />
					<div className='h-10 w-1/3 animate-pulse rounded bg-muted' />
					<div className='h-11 animate-pulse rounded-lg bg-muted' />
				</div>
			</div>
		</div>
	)
}

export default ProductLoading
