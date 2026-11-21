import type { Metadata } from 'next'
import { Suspense } from 'react'

import AddressBook from './_components/address-book'
import { getAddresses } from './_lib/queries'

export const metadata: Metadata = {
	title: 'Manzillar',
}

/** Bazadan o'qish so'rov vaqtida bajariladi — karkas oldindan tayyor turadi */
const AddressesLoader = async () => <AddressBook initial={await getAddresses()} />

const AddressesSkeleton = () => (
	<div aria-hidden>
		<div className='mb-8 space-y-3'>
			<div className='h-3 w-40 animate-pulse rounded bg-muted' />
			<div className='h-12 w-80 max-w-full animate-pulse rounded bg-muted' />
			<div className='h-4 w-96 max-w-full animate-pulse rounded bg-muted' />
		</div>
		<div className='grid gap-4 md:grid-cols-2'>
			{[0, 1].map(index => (
				<div key={index} className='h-52 animate-pulse border bg-muted/30' />
			))}
		</div>
	</div>
)

const AddressesPage = () => (
	<Suspense fallback={<AddressesSkeleton />}>
		<AddressesLoader />
	</Suspense>
)

export default AddressesPage
