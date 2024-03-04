import { useEffect, Fragment, useState, FC } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import useWishlist from '@components/services/wishlist'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { IPLPFilterState, useUI } from '@components/ui/context'
import useCart from '@components/services/cart'
import PLPSort from './PLPSort'
import { FILTER_TITLE } from '@components/utils/textVariables'

type PLPFilterSidebarProps = {
  handleSortBy: Function
  openSidebar: boolean
  handleTogglePLPSidebar: Function
  plpFilterState: IPLPFilterState | any
}

const PLPFilterSidebar: FC<PLPFilterSidebarProps> = ({ handleSortBy, openSidebar, handleTogglePLPSidebar, plpFilterState }) => {
  const { closeSidebar, setWishlist, user, wishlistItems, basketId, setCartItems, removeFromWishlist } = useUI()
  const { getWishlist, deleteWishlistItem } = useWishlist()
  const { addToCart } = useCart()
  const [isItemInCart, setItemInCart] = useState(false)
  const [filters, setFilters] = useState(plpFilterState)
  const [hasFiltersLoaded, setHasFiltersLoaded] = useState(false)

  useEffect(() => {
    if (!plpFilterState.loading && !!plpFilterState.sortList.length) {
      setHasFiltersLoaded(true)
    }
  }, [plpFilterState.loading, plpFilterState.sortList])

  useEffect(() => {
    if (hasFiltersLoaded) setFilters(plpFilterState)
  }, [hasFiltersLoaded, plpFilterState])

  const handleWishlistItems = async () => {
    const items = await getWishlist(user.userId, wishlistItems)
    setWishlist(items)
  }
  let accessToken: boolean | any = false

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }

  useEffect(() => {
    if (accessToken) handleWishlistItems()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteItemFromWishlist = (product: any) => {
    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }

    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'remove_item', {
        product_name: product?.name,
        availability: productAvailability,
        product_id: product?.sku,
      })
    }

    if (accessToken) {
      deleteWishlistItem(user.userId, product.recordId).then(() =>
        handleWishlistItems()
      )
    } else removeFromWishlist(product.recordId)
  }

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        basketId,
        productId: product.recordId,
        qty: 1,
        manualUnitPrice: product.price.raw.withTax,
        stockCode: product.stockCode,
        userId: user.userId,
        isAssociated: user.isAssociated,
      },
      'ADD',
      { product }
    )
      .then((response: any) => {
        setCartItems(response)
        setItemInCart(true)
        setTimeout(() => {
          setItemInCart(false)
        }, 3000)
      })
      .catch((err: any) => console.log('error', err))
  }

  const handleClose = () => {
    handleTogglePLPSidebar()
    setTimeout(() => closeSidebar(), 200)
  }

  return (
    <div>
      <Transition.Root show={openSidebar} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-999"
          onClose={handleClose}
        >
          <div className="absolute inset-0 overflow-hidden z-999">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="fixed top-0 right-0 inset-0 w-full h-screen bg-black/40"
                onClick={handleClose}
              />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 z-9999">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="flex flex-col h-full bg-white shadow-xl">
                    <div className="sticky top-0 p-3 bg-white border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {FILTER_TITLE}
                        </Dialog.Title>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            onClick={handleClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-y-auto">
                      <PLPSort
                        routerSortOption={filters?.sortBy}
                        sortList={filters?.sortList}
                        hasFiltersLoaded={hasFiltersLoaded}
                        action={handleSortBy}
                        closeSidebar={closeSidebar}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="sticky bottom-0 border-t border-gray-200 p-3 flex flex-wrap flex--gutter bg-white">
                      <div className="w-2/4 flex-col--half">
                        <button
                          className="w-full py-4 text-gray-200 bg-gray-900 transition hover:opacity-75"
                          type="button"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="w-2/4 flex-col--half">
                        <button
                          className="w-full py-4 text-gray-200 bg-gray-900 transition hover:opacity-75"
                          type="button"
                          onClick={() => handleClose()}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default PLPFilterSidebar
