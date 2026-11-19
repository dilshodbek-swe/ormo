/** Hafta brauzerda aniqlanguncha — o'sha bento joylashuvdagi bo'sh plitkalar */
const WeekSkeleton = () => {
	return (
		<div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
			<div className='col-span-2 h-[32rem] animate-pulse rounded-2xl bg-muted lg:row-span-2 lg:h-auto' />
			{Array.from({ length: 6 }, (_, index) => (
				<div key={index} className='h-64 animate-pulse rounded-2xl bg-muted/60' />
			))}
			<div className='col-span-2 h-64 animate-pulse rounded-2xl bg-muted/60' />
		</div>
	)
}

export default WeekSkeleton
