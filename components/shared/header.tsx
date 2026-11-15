import { Search, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from './logo'
import Nav from './nav'

const Header = () => {
	return (
		<header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md'>
			<div className='mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6'>
				<Logo className='text-2xl' />

				<Nav className='hidden md:flex' />

				<div className='ml-auto flex items-center gap-2'>
					<Button
						variant='outline'
						className='hidden w-56 justify-start text-muted-foreground sm:inline-flex'
					>
						<Search />
						<span>Qidirish...</span>
						<kbd className='ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]'>
							Ctrl K
						</kbd>
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='sm:hidden'
						aria-label='Qidirish'
					>
						<Search />
					</Button>
					<Button variant='ghost' size='icon' aria-label='Savat'>
						<ShoppingBag />
					</Button>
				</div>
			</div>

			<Nav className='mx-auto max-w-7xl overflow-x-auto px-2 pb-2 md:hidden' />
		</header>
	)
}

export default Header
