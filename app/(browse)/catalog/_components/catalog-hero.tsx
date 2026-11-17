import CatalogStats from './catalog-stats'

const CatalogHero = () => {
	return (
		<section className='border-b'>
			<div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-20 lg:flex-row lg:items-end lg:justify-between'>
				<div className='max-w-2xl space-y-5'>
					<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
						Katalog
					</p>
					<h1 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-6xl'>
						Keyingi kadringiz{' '}
						<span className='text-muted-foreground'>shu yerda boshlanadi.</span>
					</h1>
				</div>

				<CatalogStats />
			</div>
		</section>
	)
}

export default CatalogHero
