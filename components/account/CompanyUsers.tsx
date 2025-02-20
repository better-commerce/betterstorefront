import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import Spinner from '@components/ui/Spinner'
import { useTranslation } from '@commerce/utils/use-translation'
import AddNewUserModal from '@components/account/AddCompanyUser'
import { NEXT_B2B_GET_COMPANY_DETAILS } from '@components/utils/constants'
import { useUI } from '@components/ui'

function CompanyUsers({ users }: any) {
  const translate = useTranslation()
  const [isAddNewUserModalOpen, setIsAddNewUserModalOpen] = useState(false)
  const [companyDetails, setCompanyDetails] = useState<any>(null)
  const { user } = useUI()
  
  const getCompanyDetails = useCallback(async () => {
    const response: any = await axios.post(NEXT_B2B_GET_COMPANY_DETAILS, { userId: user?.userId })
    setCompanyDetails(response?.data || {})
  }, [user?.userId]) 

  useEffect(() => {
    getCompanyDetails()
  }, [])

  const toggelAddNewUserModal = () => {
    setIsAddNewUserModalOpen(!isAddNewUserModalOpen)
  }

  return (
    <section className="w-full">
      {!users ? (
        <>
          <Spinner />
        </>
      ) : (
        <div className="flex flex-col py-8 gap-y-6">
          {users?.map((user: any, Idx: any) => (
            <div key={Idx} className="flex flex-col px-6 py-4 border border-slate-200 rounded-2xl gap-y-3">
              <div className="flex flex-row gap-x-6">
                <h2 className="text-2xl font-semibold leading-6 font-Inter text-brand-blue">
                  {`${user?.firstName} ${user?.lastName}`}
                </h2>
              </div>
              <div className="flex flex-row gap-x-6">
                <span className="font-Inter uppercase font-light leading-4 text-lg tracking-[2%]">
                  {user?.companyUserRole}
                </span>
              </div>
              <div className="flex flex-row gap-x-6">
                {user?.username && <span> {translate('label.companyUsers.usernameText')} {user?.username}</span>}
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                {translate('label.companyUsers.emailText')} {user?.email}
                </span>
                {user?.phoneNo &&
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                {translate('label.companyUsers.phoneNoText')} {user?.phoneNo}
                </span>
                }
              </div>
            </div>
          ))}

          <div className=" hidden text-white sm:flex add-list-div">
            <button type="submit" onClick={(ev: any) => toggelAddNewUserModal()} className="mt-4 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">
              {translate('label.myAccount.addNewUserText')}
              <span className="inline-block ml-2 leading-none align-middle">
                <i className="sprite-icon icon-location-orange"></i>
              </span>
            </button>
          </div>
        </div>
      )}
      {isAddNewUserModalOpen && 
        <AddNewUserModal isOpen={isAddNewUserModalOpen} closeModal={toggelAddNewUserModal} companyDetails={companyDetails} btnTitle={translate('label.myAccount.addNewUserText')} />
      }
    </section>
  )
}

export default CompanyUsers
