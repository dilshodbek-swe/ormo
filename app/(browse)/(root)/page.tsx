import BestPrices from './_components/best-prices'
import Categories from './_components/categories'
import CoolestGadgets from './_components/coolest-gadgets'
import Hero from './_components/hero'

const HomePage = () => {
	return (
		<>
			<Hero />
			<Categories />
			<BestPrices />
			<CoolestGadgets />
		</>
	)
}

export default HomePage
