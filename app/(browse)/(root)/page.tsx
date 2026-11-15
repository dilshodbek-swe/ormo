import BestPrices from './_components/best-prices'
import Categories from './_components/categories'
import CoolestGadgets from './_components/coolest-gadgets'
import Hero from './_components/hero'
import Newsletter from './_components/newsletter'

const HomePage = () => {
	return (
		<>
			<Hero />
			<Categories />
			<BestPrices />
			<CoolestGadgets />
			<Newsletter />
		</>
	)
}

export default HomePage
