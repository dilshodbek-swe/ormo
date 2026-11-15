import { cacheLife } from 'next/cache'
import Link from 'next/link'

import { footerLinks } from './footer-links'
import Logo from './logo'

const CurrentYear = async () => {
	'use cache'
	cacheLife('days')

	return new Date().getFullYear()
}

const Footer = () => {
	return (
		<footer className='border-t'>
			<div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
				<div className='space-y-1'>
					<Logo className='text-lg' />
					<p className='text-sm text-muted-foreground'>
						Kameralar, stabilizatorlar va dronlar
					</p>
				</div>

				<nav className='flex flex-wrap gap-x-6 gap-y-2'>
					{footerLinks.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className='text-sm text-muted-foreground transition-colors hover:text-foreground'
						>
							{label}
						</Link>
					))}
				</nav>
			</div>

			<div className='border-t'>
				<p className='mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6'>
					© <CurrentYear /> ormo. Barcha huquqlar himoyalangan.
				</p>
			</div>
		</footer>
	)
}

export default Footer
