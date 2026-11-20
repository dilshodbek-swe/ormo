import AuthButtons from './auth-buttons'
import CartButton from './cart-button'
import Logo from './logo'
import Nav from './nav'
import SearchCommand from './search/search-command'

const Header = () => {
	return (
		<header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md'>
			<div className='mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6'>
				<Logo className='text-2xl' />

				<Nav className='hidden md:flex' />

				<div className='ml-auto flex items-center gap-2'>
					<SearchCommand />
					<CartButton />
					<AuthButtons />
				</div>
			</div>

			<Nav className='mx-auto max-w-7xl overflow-x-auto px-2 pb-2 md:hidden' />
		</header>
	)
}

export default Header
