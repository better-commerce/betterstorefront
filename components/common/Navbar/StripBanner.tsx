const offers = [
  { name: 'VIP Unlimited NDD £9.99', description: 'shop for a year *t&Cs', href: '#' },
  { name: "MID SEASON SALE: AT LEAST 50% OFF!", description: 'shop now!', href: '#' },
  { name: 'Extra 5% off Student Discount', description: 'shop now *t&cs apply', href: '#' },
]
export default function StripBanner(){
      return(
            <>
                  <nav aria-label="Offers" className="order-last lg:order-first">
                        <div className="max-w-full theme-mg-bg-orange-dark mx-auto lg:px-8">
                              <ul
                              role="list"
                              className="grid grid-cols-3 lg:grid-cols-3"
                              >
                              {offers.map((offer) => (
                              <li key={offer.name} className="flex flex-col">
                                    <a
                                    href={offer.href}
                                    className="relative flex-1 flex flex-col justify-center theme-mg-bg-orange-dark sm:py-3 py-2 sm:px-4 px-1 text-center focus:z-10"
                                    >
                                    <p className="sm:text-xl text-sm font-bold text-gray-900">{offer.name}</p>
                                    <p className="font-light text-xs text-gray-900">{offer.description}</p>
                                    </a>
                              </li>
                              ))}
                              </ul>
                        </div>
                  </nav>
            </>
      )
}