/** Rol tekshirilayotganda: admin karkasining sokin nusxasi (havolalarsiz — bo'limlar oshkor bo'lmaydi) */
const AdminShellSkeleton = () => {
	return (
		<div aria-busy aria-label='Admin panel yuklanmoqda' className='flex min-h-svh w-full'>
			<div className='hidden w-64 shrink-0 flex-col border-r bg-sidebar md:flex'>
				<div className='flex h-14 items-center gap-2.5 border-b px-4'>
					<span className='size-3.5 rotate-45 animate-pulse rounded-[3px] bg-foreground/80' />
					<span className='h-4 w-24 animate-pulse rounded bg-muted' />
				</div>
				<div className='space-y-5 p-4'>
					{[2, 3, 5, 3].map((rows, group) => (
						<div key={group} className='space-y-2.5'>
							<span className='block h-2 w-14 animate-pulse rounded bg-muted' />
							{Array.from({ length: rows }, (_, index) => (
								<span key={index} className='block h-4 w-36 animate-pulse rounded bg-muted/70' />
							))}
						</div>
					))}
				</div>
			</div>
			<div className='flex-1'>
				<div className='flex h-14 items-center gap-3 border-b px-4'>
					<span className='size-7 animate-pulse rounded-md bg-muted' />
					<span className='h-4 w-20 animate-pulse rounded bg-muted' />
					<span className='ml-auto h-8 w-60 max-w-[40%] animate-pulse rounded-md bg-muted' />
				</div>
				<div className='mx-auto w-full max-w-7xl space-y-4 px-4 py-10 sm:px-6 lg:px-8'>
					<span className='block h-3 w-32 animate-pulse rounded bg-muted' />
					<span className='block h-12 w-80 max-w-full animate-pulse rounded bg-muted' />
					<span className='block h-4 w-96 max-w-full animate-pulse rounded bg-muted' />
				</div>
			</div>
		</div>
	)
}

export default AdminShellSkeleton
