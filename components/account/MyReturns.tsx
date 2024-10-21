import { useState, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT, NEXT_GET_RETURNS } from '@components/utils/constants'
import { useUI } from '@components/ui'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import { isCartAssociated, vatIncluded } from '@framework/utils/app-util'
import moment from 'moment'
import Spinner from '@components/ui/Spinner' // Assuming you have a Spinner component

export default function MyReturns() {
  const { user, basketId, setCartItems, openCart, cartItems } = useUI()
  const translate = useTranslation();
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true) // Loading state
  const isIncludeVAT = vatIncluded()

  const fetchReturns = async () => {
    try {
      const { data }: any = await axios.post(NEXT_GET_RETURNS, {
        userId: user.userId,
      })
      setReturns(data.response.result)
    } catch (error) {
      alert(translate('label.myAccount.myOrders.fetchReturnsErrorMsg'))
      console.log(error)
    } finally {
      setLoading(false) // Set loading to false once the data is fetched
    }
  }

  useEffect(() => {
    fetchReturns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        returns?.length > 0 ? (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">Return No.</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Refund</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Date Placed</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Product</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-right text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {returns?.map((item: any, Idx: any) => {
                  return (
                    <tr key={`quote-list-${Idx}`} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                      <td className="px-3 py-3 text-[13px] font-medium text-black">
                        {item?.returnNo}
                      </td>
                      <td className="px-3 py-3 text-[13px] font-medium text-black">
                        {item?.lineItems?.map((product: any) => (
                          product?.price?.raw?.withTax > 0 ? (
                            isIncludeVAT ? (product?.price?.formatted?.withTax) : (product?.price?.formatted?.withoutTax)
                          ) : (
                            <span key={product?.productId || product?.recordId} className="font-medium uppercase text-14 xs-text-14 text-emerald-600">
                              {translate('label.orderSummary.freeText')}
                            </span>
                          )
                        ))}
                      </td>
                      <td className="px-3 py-3 text-[13px] font-medium text-black">{moment(new Date(item.returnDate)).format(DATE_FORMAT)}</td>
                      <td className="px-3 py-3 text-[13px] font-medium text-black">
                        {item?.lineItems?.map((product: any, index:number) => (
                          <Link href={`/${product.slug}`} passHref className="text-sky-500 hover:text-sky-600" key={index}>
                            {product?.name}
                          </Link>
                        ))}
                      </td>
                      <td align='right' className="px-3 py-3 text-[13px] font-medium text-black">
                        <span className='px-2 py-1 text-xs border bg-emerald-100 text-emerald-600 border-emerald-300 rounded-2xl'>{item?.returnStatusLabel}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-10'>
            <h4 className='text-xl font-normal text-gray-300'>No Return Available</h4>
          </div>
        )
      )}
    </>
  )
}
