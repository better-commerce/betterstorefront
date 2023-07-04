import cn from 'classnames'
import s from './ReferralCard.module.css'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import classNames from 'classnames'
import { Button, LoadingDots } from '@components/ui'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import ClipboardFill from '@heroicons/react/24/solid/ClipboardIcon'
interface ReferralCardProps {
  className?: string
  title: string
  description?: string
  hide?: boolean
  action?: React.ReactNode
  handleInputChange?: any
  handleNewReferral?: any
  isLoading?: any
  voucher?: any
}

const ReferralCard: React.FC<React.PropsWithChildren<ReferralCardProps>> = ({
  title,
  description,
  className,
  action,
  hide,
  handleInputChange,
  handleNewReferral,
  isLoading,
  voucher,
}) => {
  const [show, setShow] = useState(hide||!!voucher)
  const [copied, setCopied] = useState(false)
  // console.log('show:', show)
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(voucher?.voucherCode)
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }
  const rootClassName = cn(
    s.root,
    {
      transform: true,
      'translate-y-0 opacity-100': show,
      'translate-y-full opacity-0': !show,
    },
    className
  )
  return (
    <div className={classNames(show ? 'block' : 'hidden', 'px-3 py-3')}>
      <div className={rootClassName}>
        <div className="flex flex-row w-full justify-end">
          <span
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setShow(!show)
            }}
          >
            <XMarkIcon />
          </span>
        </div>
        {!voucher ? (
          <>
            <span className="block md:inline">{title}</span>
            <span className="block mb-6 md:inline md:mb-0 md:ml-2">
              {description}
            </span>
            <form
              onSubmit={handleNewReferral}
              className="flex items-center flex-col justify-center gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-100 rounded-lg  px-2 py-3"
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                className="mx-5 !text-sm btn-c btn-primary"
                // onClick={handleNewReferral}
              >
                {isLoading ? <LoadingDots /> : 'Claim your Gift!'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <span className="block md:inline">
              {"Congratulations, you've received a Voucher!"}
            </span>
            <span className="block mb-6 md:inline md:mb-0 md:ml-2">
              <div className="py-2 flex flex-row border-[1px] my-5 items-center justify-center border-gray-600">
                <p className="px-3 !mt-0 text-center font-bold ">
                  Voucher-code: {voucher?.voucherCode}
                </p>
                <div className="w-5 m-0 " onClick={handleCopyClick}>
                  {!copied ? (
                    <ClipboardIcon className="flex justify-center items-center" />
                  ) : (
                    <ClipboardFill className="flex justify-center items-center" />
                  )}
                  {/* {copied ? 'COPIED' : 'COPY CODE'} */}
                </div>
              </div>
              <p className="px-5 text-center font-bold">
                Offer: {voucher?.promoName}
              </p>
              <p className="font-bold">
                Validity:{' '}
                {`This offer is valid for ${voucher?.validityDays} Days`}
              </p>
              <p className="px-12 text-center">
                Use this voucher code in the Apply promotion section to avail
                this offer
              </p>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default ReferralCard
