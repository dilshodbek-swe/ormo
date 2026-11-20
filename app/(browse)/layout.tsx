import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import StoreHydrator from '@/lib/store/store-hydrator'

const BrowseLayout = ({ children }: LayoutProps<'/'>) => {
	return (
		<div className='flex min-h-full flex-1 flex-col'>
			<StoreHydrator />
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	)
}

export default BrowseLayout
