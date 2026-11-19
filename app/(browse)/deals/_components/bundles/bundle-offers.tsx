'use client'

import { useState } from 'react'

import { bundles } from '@/lib/data/bundles'
import BundleEquation from './bundle-equation'
import BundleTabs from './bundle-tabs'

const BundleOffers = () => {
	const [activeId, setActiveId] = useState(bundles[0].id)
	const bundle = bundles.find(item => item.id === activeId) ?? bundles[0]

	return (
		<section className='border-t bg-muted/30'>
			<div className='mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 md:py-24'>
				<div className='space-y-8'>
					<div className='max-w-2xl space-y-4'>
						<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							To&apos;plamlar
						</p>
						<h2 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-5xl'>
							To&apos;plam takliflari.{' '}
							<span className='text-muted-foreground'>Birga olsangiz — arzonroq.</span>
						</h2>
						<p className='text-muted-foreground'>{bundle.tagline}</p>
					</div>

					<BundleTabs value={activeId} onChange={setActiveId} />
				</div>

				{/* key — to'plam almashganda tanlov boshidan (hammasi tanlangan) boshlanadi */}
				<BundleEquation key={bundle.id} bundle={bundle} />

				<p className='font-mono text-xs text-muted-foreground'>
					Mahsulotni bosib to&apos;plamdan chiqarishingiz mumkin — to&apos;plam chegirmasi faqat
					to&apos;liq to&apos;plamga beriladi.
				</p>
			</div>
		</section>
	)
}

export default BundleOffers
