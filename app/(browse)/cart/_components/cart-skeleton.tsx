/** Savat brauzer xotirasidan o'qilguncha — bo'sh savatni bir lahza ko'rsatib yubormaslik uchun */
const CartSkeleton = () => {
	return (
		<div className='grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]'>
			<div className='divide-y border'>
				{Array.from({ length: 3 }, (_, index) => (
					<div key={index} className='flex items-center gap-4 p-5'>
						<div className='size-24 animate-pulse rounded-lg bg-muted' />
						<div className='flex-1 space-y-2'>
							<div className='h-3 w-16 animate-pulse rounded bg-muted' />
							<div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
						</div>
					</div>
				))}
			</div>
			<div className='h-96 animate-pulse border bg-muted/40' />
		</div>
	)
}

export default CartSkeleton
