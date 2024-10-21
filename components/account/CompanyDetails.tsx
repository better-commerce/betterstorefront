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
    <>
      {isLoading ? (<Spinner />) : (
        <>
          <section className="w-full p-6 my-4 border border-slate-200 rounded-2xl">
            <div className='flex flex-col gap-2'>
              <h2 className="text-xl font-normal sm:text-2xl dark:text-black">
                {details?.companyName}
              </h2>
              <h6 className='text-sm font-medium text-gray-700'><PhoneIcon className='inline-block w-4 h-4' /> {details?.mobile}</h6>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex gap-1 justify-normal">
                <span className="text-sm font-semibold text-black">ERP Company Code:</span>
                <span className='text-sm font-normal text-black'>{details?.erpCompanyCode}</span>
              </div>
              <div className='flex gap-1 justify-normal'>
                <span className='text-sm font-semibold text-black'>Company Code:</span>
                <span className='text-sm font-normal text-black'>{details?.companyCode}</span>
              </div>
              <div className='flex gap-1 justify-normal'>
                <span className='text-sm font-semibold text-black'>Company RegNo:</span>
                <span className='text-sm font-normal text-black'>{details?.companyRegNo}</span>
              </div>
            </div>
          </section>
          <section className="w-full p-6 my-4 border border-yellow-300 bg-yellow-50 rounded-2xl">
            <div className='flex w-full gap-10 justify-normal'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm font-semibold text-black'>Credit Limit</span>
                <span className='text-sm font-normal text-white text-center bg-[#323a46] p-2 rounded'>{details?.creditLimit?.formatted?.withTax}</span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-sm font-semibold text-black'>Credit Available</span>
                <span className='text-sm font-normal text-center text-white bg-[#1abc9c] p-2 rounded'>{details?.creditAvailable?.formatted?.withTax}</span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-sm font-semibold text-black'>Used Credit</span>
                <span className='text-sm font-normal text-center text-white bg-[#6c757d] p-2 rounded'>{details?.usedCredit?.formatted?.withTax}</span>
              </div>
            </div>
          </section>
        </>
      )}

    </>
  )
}

export default CompanyDetails
