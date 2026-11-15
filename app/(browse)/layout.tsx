import Header from '@/components/shared/header'

const BrowseLayout = ({ children }: LayoutProps<'/'>) => {
	return (
		<div className='flex min-h-full flex-1 flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
		</div>
	)
}

export default BrowseLayout
