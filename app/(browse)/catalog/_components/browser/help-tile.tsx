import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const HelpTile = () => {
	return (
		<Link
			href='/contact'
			className='group col-span-2 flex flex-col justify-between gap-8 bg-foreground p-6 text-background sm:p-8'
		>
			<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
				Tanlashda yordam
			</p>
			<div className='flex items-end justify-between gap-6'>
				<p className='font-space-grotesk text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl'>
					Qaysi biri sizga mos ekanini bilmayapsizmi?
					<span className='text-background/50'>
						{' '}
						Mutaxassisimiz 5 daqiqada maslahat beradi.
					</span>
				</p>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45'>
					<ArrowUpRight className='size-5' />
				</span>
			</div>
		</Link>
	)
}

export default HelpTile
