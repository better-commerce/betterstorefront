import React, { useState, useEffect } from 'react'
import { config } from './configs/contact'
import { useUI } from '@components/ui/context'
import { handleSubmit, URLS } from './common'

const radioBtnsConfig = [
  {
    type: 'radio',
    title: 'I want to receive offers',
    items: config,
    id: 1,
  },
  {
    type: 'radio',
    id: 2,
    title: "I don't want to receive offers",
    items: [],
    default: true,
    unsubscribe: true,
  },
]

export default function ContactPreferences() {
  const [title, setTitle] = useState('Contact')
  const [items, setItems] = useState([])
  const [activeItem, setActiveItem] = useState({ items: [] })
  const [data, setData] = useState({})
  const [defaultData, setDefaultData] = useState({})
  const { user, setUser } = useUI()

  useEffect(() => {
    const tempObj: any = {}
    let newConfig: any = radioBtnsConfig.map((radioBtn: any) => {
      radioBtn.items.map((item: any) => {
        tempObj[item.key] = user[item.key]

        if (user[item.key]) {
          item['checked'] = true
          radioBtn['checked'] = true
          return item
        }
        return item
      })
      return radioBtn
    })
    const filteredConfig =
      newConfig.filter((item: any) => item.checked)[0] ||
      newConfig.filter((item: any) => item.default)[0]
    setActiveItem(filteredConfig)
    setData(tempObj)
    setDefaultData(tempObj)
    setItems(newConfig)
  }, [])

  const handleRadioButton = (unsubscribe: boolean = false, id: number) => {
    let tempObj: any = { ...data }
    let itemsClone: any = [...items]
    let itemRef = { items: [] }
    let newItems = itemsClone.map((item: any) => {
      if (item.id === id) {
        itemRef = item
        setActiveItem(item)
        item.checked = true
      } else item.checked = false
      return item
    })
    if (unsubscribe) {
      Object.keys(tempObj).reduce((acc: any, obj: any) => {
        tempObj[obj] = false
      }, tempObj)
    } else {
      itemRef.items.map((item: any) => {
        tempObj[item.key] = !!item.checked
      })
    }
    setItems(newItems)
    setData(tempObj)
  }

  const handleDataSubmit = () => {
    handleSubmit(data, user, setUser, setTitle, URLS.subscribe)
  }

  const handleCheckbox = (key: string) => {
    let tempObj: any = { ...data }
    const newItems: any = activeItem.items.map((item: any) => {
      if (item.key === key) {
        item.checked = !item.checked
      }
      tempObj[item.key] = !!item.checked
      return item
    })
    setData(tempObj)
    setActiveItem({ items: newItems })
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
      <div className="max-w-4xl mx-auto flex flex-col mt-10">
        <div className="w-1/2 flex justify-between align-center">
          {items.map((btn: any, idx: number) => {
            return (
              <div className="flex" key={`${idx}-radio-btn`}>
                <input
                  id={`radio-btn-${idx}`}
                  name="notification-type"
                  type="radio"
                  checked={btn.checked || btn.default}
                  onClick={() => {
                    handleRadioButton(btn.unsubscribe, btn.id)
                  }}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor={`radio-btn-${idx}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {btn.title}
                </label>
              </div>
            )
          })}
        </div>
        <div className="flex flex-row">
          {activeItem.items.map((box: any, idx: number) => {
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
        </div>
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
