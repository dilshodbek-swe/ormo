const legend = [
	{ label: 'Bugun', dot: 'bg-linear-to-r from-orange-500 to-rose-500' },
	{ label: 'Tugagan', dot: 'bg-foreground/80' },
	{ label: 'Kutilmoqda', dot: 'border border-dashed border-muted-foreground' },
]

const WeekHeader = ({ range }: { range: string | null }) => {
	return (
		<div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
			<div className='space-y-4'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Hafta{range && ` · ${range}`}
				</p>
				<h2 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-5xl'>
					Yangi hafta takliflari.{' '}
					<span className='text-muted-foreground'>Har kuni — bittadan.</span>
				</h2>
			</div>

			<ul className='flex flex-wrap gap-4 text-xs text-muted-foreground'>
				{legend.map(({ label, dot }) => (
					<li key={label} className='flex items-center gap-2'>
						<span className={`size-2.5 rounded-full ${dot}`} />
						{label}
					</li>
				))}
			</ul>
		</div>
	)
}

export default WeekHeader
