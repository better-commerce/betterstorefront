import { useEffect, useState } from 'react'

const SALE_COUNT_DOWN_ENABLE_BEFORE_DAYS = 500

function ProductSaleCountdown({ startDate, endDate }: any) {
  const [shouldSaleCountdownEnable, setShouldSaleCountdownEnable] = useState(false)
  const [initialRender, setInitialRender] = useState(false)

  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date()
    let timeLeft: any

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 3600 * 24)),
        hours: Math.floor(difference / (1000 * 60 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  useEffect(() => {
    if (
      Math.sign(timeLeft?.days) === 1 &&
      timeLeft?.days <= SALE_COUNT_DOWN_ENABLE_BEFORE_DAYS
    ) {
      setShouldSaleCountdownEnable(true)
    } else {
      setShouldSaleCountdownEnable(false)
    }
  }, [timeLeft])

  if (!shouldSaleCountdownEnable) {
    return null
  }

  return (
    <div className="flex mt-1 fh-28">
      <h4 className="w-auto px-3 py-1 text-xs font-medium text-white bg-black sm:text-xs bg-brown text-md-scrn">
        OFFER ENDS IN
        <span className='pl-1'>
          {timeLeft?.hours || timeLeft?.minutes || timeLeft?.seconds ? (
            <span>{timeLeft?.days}d{' '}:{' '}{timeLeft?.hours}h{' '}:{' '}{timeLeft?.minutes}m{' '}:{' '}{timeLeft?.seconds}s</span>
          ) : (
            <span>Sale End 🔥</span>
          )}
        </span>
      </h4>
    </div>
  )
}

export default ProductSaleCountdown
