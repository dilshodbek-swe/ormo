import type { ReactNode } from 'react'

const FilterSection = ({ title, children }: { title: string; children: ReactNode }) => {
	return (
		<section className='space-y-3 border-b py-5 last:border-b-0'>
			<h3 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
				{title}
			</h3>
			{children}
		</section>
	)
}

export default FilterSection
