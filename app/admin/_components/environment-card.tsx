import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const isProduction = process.env.NODE_ENV === 'production'

/** Vercel'dagi "deployment" kartasi kabi: qaysi muhitda ishlayapmiz va saytga tez o'tish */
const EnvironmentCard = () => {
	return (
		<div className='mx-3 mt-auto mb-2 overflow-hidden rounded-lg border bg-background group-data-[collapsible=icon]:hidden'>
			<div className='flex items-center gap-2 border-b px-3 py-2.5'>
				<span className='relative flex size-2'>
					<span
						className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${isProduction ? 'bg-emerald-500' : 'bg-amber-500'}`}
					/>
					<span className={`relative inline-flex size-2 rounded-full ${isProduction ? 'bg-emerald-500' : 'bg-amber-500'}`} />
				</span>
				<span className='text-xs font-medium'>{isProduction ? 'Production' : 'Development'}</span>
				<span className='ml-auto font-mono text-[10px] text-muted-foreground'>
					{isProduction ? 'live' : 'localhost'}
				</span>
			</div>
			<dl className='space-y-1.5 px-3 py-2.5 text-xs'>
				<div className='flex justify-between gap-2'>
					<dt className='text-muted-foreground'>Ma&apos;lumotlar</dt>
					<dd className='font-mono'>namunaviy</dd>
				</div>
				<div className='flex justify-between gap-2'>
					<dt className='text-muted-foreground'>Auth</dt>
					<dd className='font-mono'>Clerk</dd>
				</div>
			</dl>
			<Link
				href='/'
				target='_blank'
				className='flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
			>
				Saytni ochish
				<ArrowUpRight className='size-3.5' />
			</Link>
		</div>
	)
}

export default EnvironmentCard
