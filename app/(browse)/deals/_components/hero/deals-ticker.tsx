import { deals } from '@/lib/data/deals'

/** Hero ostidagi cheksiz aylanuvchi chegirmalar lentasi */
const DealsTicker = () => {
	return (
		<div className='overflow-hidden border-t border-background/10 py-4 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]'>
			<div className='flex w-max motion-safe:animate-marquee'>
				{[0, 1].map(copy => (
					<ul key={copy} aria-hidden={copy === 1} className='flex shrink-0 items-center'>
						{deals.map(deal => (
							<li
								key={deal.id}
								className='flex items-center gap-3 pr-8 font-mono text-sm whitespace-nowrap'
							>
								<span className='text-background/50'>
									{deal.brand} {deal.name}
								</span>
								<span className='font-semibold text-rose-400'>-{deal.discount}%</span>
								<span aria-hidden className='text-background/20'>
									✦
								</span>
							</li>
						))}
					</ul>
				))}
			</div>
		</div>
	)
}

export default DealsTicker
