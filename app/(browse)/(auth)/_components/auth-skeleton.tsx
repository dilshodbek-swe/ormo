/** Forma yuklanguncha ko'rinadigan skelet (useSearchParams uchun Suspense fallback) */
const AuthSkeleton = ({ fields = 2 }: { fields?: number }) => {
	return (
		<div aria-hidden className='space-y-6 p-6 sm:p-8'>
			<div className='space-y-2'>
				<div className='h-7 w-3/4 animate-pulse rounded-md bg-muted' />
				<div className='h-4 w-full animate-pulse rounded-md bg-muted' />
			</div>
			{Array.from({ length: fields }, (_, index) => (
				<div key={index} className='space-y-2'>
					<div className='h-4 w-24 animate-pulse rounded bg-muted' />
					<div className='h-10 animate-pulse rounded-lg bg-muted' />
				</div>
			))}
			<div className='h-10 animate-pulse rounded-lg bg-muted' />
		</div>
	)
}

export default AuthSkeleton
