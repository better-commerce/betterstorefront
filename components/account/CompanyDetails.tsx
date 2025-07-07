import React, { useEffect, useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import axios from 'axios'
import { NEXT_B2B_GET_COMPANY_DETAILS } from '@components/utils/constants'
import { PhoneIcon } from '@heroicons/react/24/outline';
import Spinner from '@components/ui/Spinner';

function CompanyDetails({ user }: any) {
  const translate = useTranslation();
  const [details, setDetails] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const fetchCompanyDetails = async () => {
    let { data: company } = await axios.post(NEXT_B2B_GET_COMPANY_DETAILS, {
      userId: user,
    })
    setIsLoading(false)
    setDetails(company)
  }

  useEffect(() => {
    fetchCompanyDetails()
  }, [])
  return (
    <section className="w-full  mx-auto px-2 sm:px-4 md:px-0">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Company Info */}
          <section className="w-full p-4 sm:p-6 my-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-black mb-1">
                  {details?.companyName}
                </h2>
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <PhoneIcon className="inline-block w-4 h-4 mr-1 text-gray-400" aria-hidden="true" />
                  <span aria-label="Company phone">{details?.mobile}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div>
                <span className="block text-xs font-semibold text-gray-500">ERP Company Code</span>
                <span className="block text-sm font-medium text-gray-900">{details?.erpCompanyCode}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500">Company Code</span>
                <span className="block text-sm font-medium text-gray-900">{details?.companyCode}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500">Company RegNo</span>
                <span className="block text-sm font-medium text-gray-900">{details?.companyRegNo}</span>
              </div>
            </div>
          </section>

          {/* Credit Info */}
          <section className="w-full p-4 sm:p-6 my-4 border border-yellow-200 bg-yellow-50 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-xs font-semibold text-gray-700 mb-1">Credit Limit</span>
                <span className="text-base font-bold text-white text-center bg-[#323a46] px-3 py-2 rounded w-full min-w-[100px]">{details?.creditLimit?.formatted?.withTax}</span>
              </div>
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-xs font-semibold text-gray-700 mb-1">Credit Available</span>
                <span className="text-base font-bold text-white text-center bg-[#1abc9c] px-3 py-2 rounded w-full min-w-[100px]">{details?.creditAvailable?.formatted?.withTax}</span>
              </div>
              <div className="flex flex-col items-start sm:items-center">
                <span className="text-xs font-semibold text-gray-700 mb-1">Used Credit</span>
                <span className="text-base font-bold text-white text-center bg-[#6c757d] px-3 py-2 rounded w-full min-w-[100px]">{details?.usedCredit?.formatted?.withTax}</span>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  )
}

export default CompanyDetails
