import { useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import withAuth from '@components/utils/withAuth'
import { isB2BUser } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import Spinner from '@components/ui/Spinner'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function RequestQuoteDetail({ deviceInfo }: any) {
  const { user, changeMyAccountTab, isGuestUser } = useUI()
  const translate = useTranslation()

  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote'))
  }, [changeMyAccountTab, translate])

  if (!isB2BUser(user)) {
    return <Spinner />
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pt-0 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-6">Request A Quote</h1>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <input type="text" placeholder="First Name" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <input type="text" placeholder="Last Name" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <input type="email" placeholder="Email Address" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input type="tel" placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company *</label>
            <input type="text" placeholder="Company" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input type="text" placeholder="Role" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea placeholder="Notes" className="w-full p-2 border border-gray-300 rounded-md h-24"></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">PO Number</label>
            <input type="text" placeholder="PO Number" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Do Not Ship Later Than</label>
            <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Assigned To</label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Assigned To</option>
            {/* Add options dynamically */}
          </select>
        </div>

        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="space-y-4 mb-6">
            {/* Example of a product item */}
            <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
              <div>
                <a href="#" className="text-xs underline text-blue-600">6VC22 - Bluetooth Barcode Scanner</a>
              </div>
              <div className="flex space-x-4">
                <p className="text-xs">QTY: 14 | Target Price: $0.00 | Listed Price: $332.50</p>
                <PencilIcon className="h-4 w-4 text-gray-600 cursor-pointer" />
                <TrashIcon className="h-4 w-4 text-red-600 cursor-pointer" />
              </div>
            </div>
            {/* Add more product items here */}
          </div>
          <button type="button" className="text-black underline mb-6">+ Add Another Product</button>
        </div>

        <div className="flex space-x-4 mt-6">
          <button type="button" className="px-4 py-2 bg-transparent border border-gray-600 text-gray-700 rounded-md">Back</button>
          <button type="submit" className="px-4 py-2 btn btn-primary text-white rounded-md">Submit Request</button>
        </div>
      </form>
    </div>
  )
}

RequestQuoteDetail.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(RequestQuoteDetail), PAGE_TYPES.RequestQuote, true, LayoutAccount)
