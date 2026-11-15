import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { categories, type Category } from '@/lib/data/categories'
import { cn } from '@/lib/utils'

const CategoryCard = ({
	category,
	featured = false,
}: {
	category: Category
	featured?: boolean
}) => {
	const { id, title, image, description } = category

	return (
		<Link
			href={`/${id}`}
			className={cn(
				'group flex flex-col overflow-hidden rounded-xl border bg-background transition-colors hover:border-foreground/20',
				featured ? 'min-h-96 md:row-span-2' : 'min-h-80'
			)}
		>
			<div className='relative flex-1 bg-white'>
				<div className='absolute inset-0 flex items-center justify-center p-6'>
					<Image
						src={image}
						alt={title}
						width={1200}
						height={1200}
						sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'}
						className='h-full w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-500 ease-out group-hover:scale-105'
					/>
				</div>
			</div>

			<div className='flex items-start justify-between gap-4 border-t p-5'>
				<div className='space-y-1'>
					<h3 className='font-space-grotesk text-lg font-semibold tracking-tight'>
						{title}
					</h3>
					<p className='text-sm text-muted-foreground'>{description}</p>
				</div>
				<ArrowUpRight className='size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground' />
			</div>
		</Link>
	)
}

const Categories = () => {
	return (
		<section className='border-b'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
				<div className='mb-10 max-w-xl space-y-3'>
					<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
						Kategoriyalar
					</p>
					<h2 className='font-space-grotesk text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
						Ijodingiz uchun kerakli jihozni tanlang
					</h2>
				</div>

				<div className='grid gap-4 md:grid-cols-2'>
					{categories.map((category, index) => (
						<CategoryCard
							key={category.id}
							category={category}
							featured={index === 0}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default Categories
