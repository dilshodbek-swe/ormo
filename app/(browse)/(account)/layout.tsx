import AccountNav from './_components/account-nav'

/** Profil, buyurtmalar va sozlamalar uchun umumiy karkas (himoya — proxy.ts da) */
const AccountLayout = ({ children }: LayoutProps<'/'>) => {
	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12'>
			<div className='grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14'>
				<AccountNav />
				<div className='min-w-0'>{children}</div>
			</div>
		</div>
	)
}

export default AccountLayout
