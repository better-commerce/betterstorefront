import Spinner from '@components/ui/Spinner'
import React from 'react'

function CompanyUsers({ users }: any) {
  return (
    <section className="w-full">
      {!users ? (
        <>
          <Spinner />
        </>
      ) : (
        <div className="flex flex-col gap-y-6 p-8">
          {users?.map((user: any, Idx: any) => (
            <div
              key={Idx}
              className="flex border-[1px] flex-col gap-y-3 px-6 py-4"
            >
              <div className="flex flex-row gap-x-6">
                <h2 className="text-2xl font-Inter font-semibold text-brand-blue leading-6">
                  {`${user?.firstName} ${user?.lastName}`}
                </h2>
              </div>
              <div className="flex flex-row gap-x-6">
                <span className="font-Inter uppercase font-light leading-4 text-lg tracking-[2%]">
                  {user?.companyUserRole}
                </span>
              </div>
              <div className="flex flex-row gap-x-6">
                {user?.username && <span>Username: {user?.username}</span>}
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  Email: {user?.email}
                </span>
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  Phone No: {user?.phoneNo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CompanyUsers
