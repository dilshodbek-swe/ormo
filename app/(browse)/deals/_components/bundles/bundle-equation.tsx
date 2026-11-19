'use client'

import { Fragment } from 'react'

import type { Bundle } from '@/lib/data/bundles'
import BundleItem from './bundle-item'
import BundleOperator from './bundle-operator'
import BundleSummary from './bundle-summary'
import useBundleSelection from './use-bundle-selection'

/** [mahsulot] + [mahsulot] + [mahsulot] = [to'plam narxi] */
const BundleEquation = ({ bundle }: { bundle: Bundle }) => {
	const { isSelected, toggle, totals } = useBundleSelection(bundle)

	return (
		<div className='animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-2 duration-500 lg:gap-3 lg:flex-row lg:items-stretch'>
			{bundle.products.map((product, index) => (
				<Fragment key={product.id}>
					{index > 0 && <BundleOperator type='plus' />}
					<BundleItem
						product={product}
						selected={isSelected(product.id)}
						onToggle={() => toggle(product.id)}
					/>
				</Fragment>
			))}

			<BundleOperator type='equals' className='rotate-90 lg:rotate-0' />
			<BundleSummary discount={bundle.discount} totals={totals} className='lg:w-72 lg:shrink-0' />
		</div>
	)
}

export default BundleEquation
