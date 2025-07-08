import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
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

  // Reorder users so current user is at the top, without duplication
  const currentUserId = user?.userId;
  const reorderedUsers = React.useMemo(() => {
    if (!users || !currentUserId) return users;
    const currentUser = users?.find((u: any) => u?.userId === currentUserId);
    const otherUsers = users?.filter((u: any) => u?.userId !== currentUserId);
    return currentUser ? [currentUser, ...otherUsers] : users;
  }, [users, currentUserId]);

  return (
    <section className="w-full">
      {!users ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2 mt-4 sm:gap-4 sm:grid-cols-3">
            {reorderedUsers?.map((user: any, Idx: any) => {
              const isCurrentUser = user?.userId === currentUserId;
              const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
              return (
                <div
                  key={Idx}
                  className={`relative flex flex-col md:flex-row items-center md:items-stretch gap-4 px-3 py-4 rounded-2xl shadow transition-shadow border ${isCurrentUser
                    ? 'bg-blue-50 border-2 border-sky-500'
                    : 'bg-white border-slate-200 hover:shadow-lg'
                    }`}
                  style={{}}
                >

                  {/* User Info */}
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex flex-col gap-1">
                      <h2 className="flex items-center gap-2 font-semibold text-md font-Inter text-brand-blue">
                        <span className={`flex items-center justify-center w-8 h-8 text-sm rounded-full ${user?.companyUserRole === 'Admin' ? 'bg-sky-200 text-sky-600' : user?.companyUserRole === 'SalesUser' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-black'}`}>{initials}</span>
                        {`${user?.firstName} ${user?.lastName}`}</h2>
                      {user?.companyUserRole && (
                        <span className={`ml-0 px-2 py-1 rounded-full text-xs font-medium tracking-wider flex items-center ${user?.companyUserRole === 'Admin' ? 'bg-sky-200 text-sky-600' : user?.companyUserRole === 'SalesUser' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-black'}`}>
                          {user?.companyUserRole == 'SalesUser' ? 'Sales User' : user?.companyUserRole}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 pt-3 mt-3 border-t border-slate-100 md:grid-cols-1 gap-y-2 gap-x-6">
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="inline-block text-xs font-semibold">Email:</span>
                        <span className="text-xs font-medium">{user?.email}</span>
                      </span>
                      {user?.phoneNo && (
                        <span className="flex items-center gap-2 text-slate-600">
                          <span className="inline-block text-xs font-semibold">Phone:</span>
                          <span className="text-xs font-medium">{user?.phoneNo}</span>
                        </span>
                      )}
                      {/* <span className="flex items-center gap-2 text-emerald-500">
                        <span className="inline-block text-xs font-semibold">Credit Limit:</span>
                        <span className="text-xs font-medium">{user?.phoneNo}</span>
                      </span>
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="inline-block text-xs font-semibold">Order Placed:</span>
                        <span className="text-xs font-medium">3</span>
                      </span> */}
                    </div>
                  </div>
                </div>
              );
            })}


          </div>
          <div className="flex justify-end hidden text-white sm:flex add-list-div">
            <button type="submit" onClick={(ev: any) => toggelAddNewUserModal()} className="mt-4 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-2 px-4 sm:py-2.5 sm:px-6  ttnc-ButtonPrimary button-primary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">
              {translate('label.myAccount.addNewUserText')}
              <span className="inline-block ml-2 leading-none align-middle">
                <i className="sprite-icon icon-location-orange"></i>
              </span>
            </button>
          </div>
        </>
      )}
      {isAddNewUserModalOpen &&
        <AddNewUserModal isOpen={isAddNewUserModalOpen} closeModal={toggelAddNewUserModal} companyDetails={companyDetails} btnTitle={translate('label.myAccount.addNewUserText')} />
      }
    </section>
  )
}

export default CompanyUsers
