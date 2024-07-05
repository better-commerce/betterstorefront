import { CheckoutStep } from '@framework/utils/enums'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

export default function CheckoutEmailHeader({ user, currentStep, goToStep, isLoggedIn }: any) {
  if ([CheckoutStep.LOGIN, CheckoutStep.REVIEW, CheckoutStep.DELIVERY].includes(currentStep)) {
    return <></>
  }

  return (
    <div className="flex justify-between items-center gap-0 p-2 my-2 border border-gray-200 rounded-md sm:my-4 sm:p-4 bg-gray-50">
      <span className="font-semibold text-black font-14 mob-font-12 dark:text-black">{user?.userEmail || user?.email}</span>
      {!isLoggedIn && (
        <button onClick={() => goToStep(CheckoutStep.LOGIN)}>
          <PencilSquareIcon className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}