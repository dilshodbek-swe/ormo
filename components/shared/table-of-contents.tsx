'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface TableOfContentsProps {
	items: { id: string; title: string }[]
}

/** O'qilayotgan bo'limni kuzatib, mundarijada belgilab turadi */
const TableOfContents = ({ items }: TableOfContentsProps) => {
	const [activeId, setActiveId] = useState(items[0]?.id)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const visible = entries.find(entry => entry.isIntersecting)
				if (visible) setActiveId(visible.target.id)
			},
			// Ekranning yuqori qismiga yetgan bo'lim faol hisoblanadi
			{ rootMargin: '-80px 0px -70% 0px' }
		)

		items.forEach(({ id }) => {
			const element = document.getElementById(id)
			if (element) observer.observe(element)
		})

		return () => observer.disconnect()
	}, [items])

	return (
		<nav aria-label='Mundarija' className='space-y-3'>
			<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
				Mundarija
			</p>
			<ol className='border-l'>
				{items.map(({ id, title }, index) => {
					const isActive = id === activeId

					return (
						<li key={id}>
							<a
								href={`#${id}`}
								aria-current={isActive ? 'true' : undefined}
								className={cn(
									'-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors',
									isActive
										? 'border-foreground text-foreground'
										: 'border-transparent text-muted-foreground hover:text-foreground'
								)}
							>
								<span className='font-mono text-xs tabular-nums opacity-60'>
									{String(index + 1).padStart(2, '0')}
								</span>
								{title}
							</a>
						</li>
					)
				})}
			</ol>
		</nav>
	)
}

export default TableOfContents
