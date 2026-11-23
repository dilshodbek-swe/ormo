import type { ReactNode } from 'react'

interface PageHeaderProps {
	eyebrow: string
	title: ReactNode
	description?: ReactNode
	action?: ReactNode
}

/** Sayt bo'ylab bir xil sarlavha: mono "eyebrow" + katta Space Grotesk sarlavha */
const PageHeader = ({ eyebrow, title, description, action }: PageHeaderProps) => {
	return (
		<div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div className='space-y-3'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					{eyebrow}
				</p>
				<h1 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-5xl'>
					{title}
				</h1>
				{description && <p className='max-w-xl text-muted-foreground'>{description}</p>}
			</div>
			{action}
		</div>
	)
}

export default PageHeader
