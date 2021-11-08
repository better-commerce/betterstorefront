import React, { useState, useEffect } from 'react'
import { config } from './configs/contact'
import { useUI } from '@components/ui/context'
import { handleSubmit, URLS } from './common'

export default function ContractPreferences() {
  const [title, setTitle] = useState('My Details')
  const [checkboxes, setCheckboxes] = useState(config)
  const { user, setUser } = useUI()

  useEffect(() => {
    let newConfig = config.map((item: any) => {
      if (user[item.key]) {
        item['checked'] = true
        return item
      }
      return item
    })
    setCheckboxes(newConfig)
  }, [])

  const handleCheckbox = (key: string) => {
    const items = checkboxes.map((box: any) => {
      if (box.key === key) {
        box.checked = !box.checked
      } else box.checked = false
      return box
    })
    setCheckboxes(items)
  }

  const handleDataSubmit = (values: any) => {
    const notificationValues: any = {}
    checkboxes.forEach((box: any) => {
      notificationValues[box.key] = !!box.checked
    })
    handleSubmit(notificationValues, user, setUser, setTitle, URLS.subscribe)
  }

  return (
    <main className="sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm flex flex-col text-gray-500">
            <span>
              {' '}
              Please note, when you update your preferences they will be saved
              but they won’t be reflected right away.
            </span>
            <span className="mt-5">
              {' '}
              Receive emails and texts containing tips, guidance, offers and
              news on new products and services.
            </span>
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row flex-wrap mt-10">
        {checkboxes.map((box: any, idx: number) => {
          return (
            <div className="w-1/2 py-5 flex items-center" key={idx}>
              <input
                name={`${idx}-input[]`}
                defaultValue={box.key}
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded filter-input"
              />

              <label
                htmlFor={`${idx}-input[]`}
                onClick={() => handleCheckbox(box.key)}
                className="cursor-pointer text-sm text-gray-500 relative filter-label"
              >
                {box.checked && (
                  <div
                    style={{
                      content: '',
                      float: 'left',
                      left: '6px',
                      top: '0px',
                      zIndex: 99999,
                      position: 'absolute',
                      width: '10px',
                      height: '14px',
                      border: 'solid #000',
                      borderWidth: '0 2px 2px 0',
                      transform: 'rotate(45deg)',
                    }}
                  />
                )}
                <div
                  style={{
                    content: '',
                    float: 'left',
                    height: '20px',
                    width: '20px',
                    borderRadius: '2px',
                    border: '1px solid #cacaca',
                    position: 'relative',
                    marginRight: '10px',
                  }}
                />
              </label>
              <span>{box.label}</span>
            </div>
          )
        })}
        <div className="mt-10 flex sm:flex-col1">
          <button
            type="submit"
            onClick={handleDataSubmit}
            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
          >
            Save changes
          </button>
        </div>
      </div>
    </main>
  )
}
