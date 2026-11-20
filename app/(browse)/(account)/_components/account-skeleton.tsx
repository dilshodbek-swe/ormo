/** Clerk foydalanuvchi ma'lumotini yuklaguncha ko'rinadigan skelet */
const AccountSkeleton = ({ cards = 2 }: { cards?: number }) => {
	return (
		<div aria-hidden className='space-y-6'>
			<div className='h-56 animate-pulse border bg-muted/40' />
			{Array.from({ length: cards }, (_, index) => (
				<div key={index} className='space-y-4 border p-6'>
					<div className='h-6 w-40 animate-pulse rounded bg-muted' />
					<div className='h-4 w-2/3 animate-pulse rounded bg-muted' />
					<div className='h-10 max-w-sm animate-pulse rounded-lg bg-muted' />
				</div>
			))}
		</div>
	)
}

export default AccountSkeleton
