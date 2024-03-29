import React, { useState, useEffect } from 'react'
import { config } from './configs/contact'
import { Formik, Form, Field } from 'formik'
import { useUI } from '@components/ui/context'
import { handleSubmit, URLS } from './common'
import Button from '@components/ui/Button'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  GENERAL_WANT_RECEIVE_OFFERS,
  GENERAL_NOT_WANT_RECEIVE_OFFERS,
  CONTACT_PREFERENCES_TITLE,
  CONTACT_PREFERENCES_SUBTITLE,
  GENERAL_SAVE_CHANGES,
} from '@components/utils/textVariables'
const radioBtnsConfig = [
  {
    type: 'radio',
    title: GENERAL_WANT_RECEIVE_OFFERS,
    items: config,
    id: 1,
  },
  {
    type: 'radio',
    id: 2,
    title: GENERAL_NOT_WANT_RECEIVE_OFFERS,
    items: [],
    default: true,
    unsubscribe: true,
  },
]

export default function ContactPreferences() {
  const [title, setTitle] = useState('Contact')
  const [items, setItems] = useState([])
  const [activeItem, setActiveItem] = useState({
    items: [],
    checked: false,
    id: 2,
  })
  const [data, setData] = useState({})
  const [defaultData, setDefaultData] = useState({})
  const { user, setUser } = useUI()
  const { CustomerUpdated } = EVENTS_MAP.EVENT_TYPES

  const initialValues = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    mobile: user.mobile,
    phone: user.phone,
  }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDataSubmit = async () => {
    await handleSubmit(data, user, setUser, setTitle, URLS.subscribe)
    eventDispatcher(CustomerUpdated, {
      entity: JSON.stringify({
        id: user.userId,
        name: user.username,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        email: user.email,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      eventType: CustomerUpdated,
    })
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
    setActiveItem({ ...activeItem, items: newItems })
  }

  return (
    <main className="lg:px-8 px-4">
      <div className="max-w-4xl">
        <div className="lg:px-4 sm:px-0 pt-5">
          {/* <h1 className="font-extrabold tracking-tight text-gray-900">
            {title}
          </h1> */}
          <p className="mt-2 text-sm flex flex-col text-black">
            <span className="font-medium"> {CONTACT_PREFERENCES_TITLE}</span>
            <span className="font-medium"> {CONTACT_PREFERENCES_SUBTITLE}</span>
          </p>
        </div>
      </div>
      <div className="max-w-4xl lg:mx-12 flex flex-col mt-10">
        <div className="lg:w-1/2 lg:flex justify-between lg:align-center">
          {items.map((btn: any, idx: number) => {
            return (
              <div className="flex" key={`${idx}-radio-btn`}>
                <input
                  id={`radio-btn-${idx}`}
                  name="notification-type"
                  type="radio"
                  checked={activeItem.id === btn.id}
                  onClick={() => {
                    handleRadioButton(btn.unsubscribe, btn.id)
                  }}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label
                  htmlFor={`radio-btn-${idx}`}
                  className="ml-3 block text-sm font-medium text-black"
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
                        // zIndex: 99999,
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
        <Formik initialValues={initialValues} onSubmit={handleDataSubmit}>
          {({ handleSubmit, isSubmitting }: any) => {
            return (
              <div className="mt-10 flex sm:flex-col1 w-60">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-c btn-primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && GENERAL_SAVE_CHANGES}
                </Button>
              </div>
            )
          }}
        </Formik>
      </div>
    </main>
  )
}
