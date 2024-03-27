import { useState, useEffect } from 'react'

export default function ProgressBar() {
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    let count = setInterval(() => {
      setProgressPercent((c: number) => c + 1)
    })
    return () => clearInterval(count)
  }, [])

  return (
    <div className="fixed top-0 w-full z-9999">
      <div className="flex h-1 overflow-hidden text-xs bg-gray-50">
        <div
          style={{
            transition: 'width 1s ease-in-out',
            width: `${progressPercent}%`,
          }}
          className="flex flex-col justify-center text-center text-white bg-orange-500 shadow-none whitespace-nowrap"
        ></div>
      </div>
    </div>
  )
}
