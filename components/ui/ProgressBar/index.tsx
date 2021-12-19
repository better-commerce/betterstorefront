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
    <div className="fixed top-0 w-full z-50">
      <div className="overflow-hidden h-2 text-xs flex bg-indigo-200">
        <div
          style={{
            transition: 'width 1s ease-in-out',
            width: `${progressPercent}%`,
          }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
        ></div>
      </div>
    </div>
  )
}
