import React, { useEffect, useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import axios from 'axios'
import { NEXT_B2B_GET_COMPANY_DETAILS } from '@components/utils/constants'

function CompanyDetails({ user }: any) {
  const translate = useTranslation();
  const [details, setDetails] = useState<any>()
  const fetchCompanyDetails = async () => {
    let { data: company } = await axios.post(NEXT_B2B_GET_COMPANY_DETAILS, {
      userId: user,
    })
    setDetails(company)
  }

  useEffect(() => {
    fetchCompanyDetails()
  }, [])
  return (
    <section className="w-full">
      <div className='flex flex-col gap-1 mt-6'>
        <h2 className="text-2xl font-semibold sm:text-3xl dark:text-black">
          {details?.companyName}
        </h2>
        <h5 className='text-sm font-normal text-gray-700'>{details?.email}</h5>
        <h6 className='text-sm font-medium text-gray-700'>M:{details?.mobile}</h6>
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
        <div className='flex gap-10 mt-6 justify-normal'>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-semibold text-black'>Credit Limit:</span>
            <span className='text-sm font-normal text-black'>{details?.creditLimit?.formatted?.withTax}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-semibold text-black'>Credit Available:</span>
            <span className='text-sm font-normal text-black'>{details?.creditAvailable?.formatted?.withTax}</span>
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-semibold text-black'>Used Credit:</span>
            <span className='text-sm font-normal text-black'>{details?.usedCredit?.formatted?.withTax}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyDetails
