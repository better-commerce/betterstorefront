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
        <div className="flex flex-col py-8 gap-y-6">
          {reorderedUsers?.map((user: any, Idx: any) => {
            const isCurrentUser = user?.userId === currentUserId;
            const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
            return (
              <div
                key={Idx}
                className={`relative flex flex-col md:flex-row items-center md:items-stretch gap-4 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border ${
                  isCurrentUser
                    ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-200'
                    : 'bg-white border-slate-200'
                }`}
                style={{}}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow ${
                      isCurrentUser
                        ? 'bg-slate-200 text-slate-700 ring-2 ring-slate-300'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {initials}
                  </div>
                  {isCurrentUser && (
                    <span
                      className="mt-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md"
                      style={{ background: 'linear-gradient(to right, #3b82f6, #60a5fa)' }}
                    >
                      You
                    </span>
                  )}
                </div>
                {/* User Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h2 className="text-2xl font-semibold font-Inter text-brand-blue flex items-center gap-2">{`${user?.firstName} ${user?.lastName}`}
                      {user?.companyUserRole && (
                        <span
                          className="ml-0 md:ml-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow border border-slate-200 bg-slate-100 text-slate-700 flex items-center"
                          style={{ letterSpacing: '0.13em' }}
                        >
                          {user?.companyUserRole}
                        </span>
                      )}
                    </h2>
                  </div>
                  <div className="mt-3 border-t border-slate-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                    {user?.username && (
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="inline-block text-lg">👤</span>
                        <span className="font-medium">{user?.username}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="inline-block text-lg"><EnvelopeIcon className="w-5 h-5"/></span>
                      <span className="font-medium">{user?.email}</span>
                    </span>
                    {user?.phoneNo && (
                      <span className="flex items-center gap-2 text-slate-600">
                        <span className="inline-block text-lg"><PhoneIcon className="w-5 h-5"/></span>
                        <span className="font-medium">{user?.phoneNo}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className=" hidden text-white sm:flex add-list-div">
            <button type="submit" onClick={(ev: any) => toggelAddNewUserModal()} className="mt-4 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary button-primary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">
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
