import { useState, useEffect } from 'react'

export default function ProgressBar() {
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    setInterval(() => setProgressPercent(progressPercent + 1), 100)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden h-2 text-xs flex bg-indigo-200">
        <div
          style={{
            transition: 'width 1s ease-in-out',
          }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
        ></div>
      </div>
    </div>
  )
}
