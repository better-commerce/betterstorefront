import React from 'react'

const OptMembershipModal = ({ open }: any) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <div className="flex justify-end">
          {/* Close button */}
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">GET 20% OFF + FREE DELIVERY</h2>
        <p className="mb-6 text-gray-600">
          That's currently a saving of £28.80 on your order today when you
          become a
        </p>
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold mr-2">LIFS</span>
          <span className="text-gray-500">member</span>
        </div>
        <h3 className="text-lg font-semibold mb-4">What you get as a member</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16l7.07-16.97 7.9 16.97H3zm7-15l-5 13h11l-6-13z"
              />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              Unlimited FREE* delivery
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              Member-only offers and sales
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              20% off whenever you want**
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {/* Membership options */}
          <div className="bg-gray-100 rounded-md p-4">
            <h4 className="text-lg font-semibold mb-2">My TFS</h4>
            <p className="text-gray-600 mb-2">3 x 20% discounts anytime</p>
            <p className="text-gray-800 font-bold">£15.00 per year</p>
          </div>
          <div className="bg-gray-100 rounded-md p-4">
            <h4 className="text-lg font-semibold mb-2">My TFS Plus</h4>
            <p className="text-gray-600 mb-2">5 x 20% discounts anytime</p>
            <p className="text-gray-800 font-bold">£25.00 per year</p>
          </div>
          <div className="bg-gray-100 rounded-md p-4">
            <h4 className="text-lg font-semibold mb-2">My TFS Family</h4>
            <p className="text-gray-600 mb-2">
              UNLIMITED x 20% discounts anytime
            </p>
            <p className="text-gray-800 font-bold">£39.00 per year</p>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
            Apply discounts to this order
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
            ADD TO BAG
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm">Terms & conditions</p>
      </div>
    </div>
  )
}

export default OptMembershipModal
