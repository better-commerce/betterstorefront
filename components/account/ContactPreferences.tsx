import React, { useState, useEffect } from 'react'
import { useContactPrefConfig } from './configs/contact'
import { Formik} from 'formik'
import { useUI } from '@components/ui/context'
import { useHandleSubmit, URLS } from './common'
import Button from '@components/ui/Button'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useTranslation } from '@commerce/utils/use-translation'

interface ContactPreferencesProps {
  hideSubmitBtn?: boolean;
  customSubmit?: boolean;
  setCustomSubmit?: any;
}

interface FormStates {
  notifyByEmail: boolean;
  notifyByPost: boolean;
  notifyBySMS: boolean;
}

export default function ContactPreferences({hideSubmitBtn = false, customSubmit = false, setCustomSubmit }: ContactPreferencesProps) {
  const handleSubmit = useHandleSubmit();
  const translate = useTranslation();
  const [title, setTitle] = useState('Contact')
  const [items, setItems] = useState([])
  const [activeItem, setActiveItem] = useState({
    items: [],
    checked: false,
    id: 2,
  })
  const [data, setData] = useState<FormStates>()
  const [defaultData, setDefaultData] = useState({})
  const config = useContactPrefConfig();
  const radioBtnsConfig = [
    {
      type: 'radio',
      title: translate('label.contactPreferences.receiveOfferText'),
      items: config,
      id: 1,
    },
    {
      type: 'radio',
      id: 2,
      title: translate('label.contactPreferences.dontWantReceiveOfferText'),
      items: [],
      default: true,
      unsubscribe: true,
    },
  ]
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

  useEffect(()=>{
    if(customSubmit){
      handleDataSubmit()
    }
  },[customSubmit])

  const handleDataSubmit = async () => {
    if(data?.notifyByEmail != user?.notifyByEmail || data?.notifyByPost != user?.notifyByPost || data?.notifyBySMS != user?.notifyBySMS){
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
      if(hideSubmitBtn) setCustomSubmit(false)
    }
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
    <main className="">
      <div className="max-w-4xl">
        <div className="">
          {/* <h1 className="font-extrabold tracking-tight text-gray-900">
            {title}
          </h1> */}
          <p className="flex flex-col mt-2 text-sm text-black dark:text-black">
            <span className="font-medium"> {translate('label.contactPreferences.contactPrefDescTitle')}</span>
            <span className="font-medium"> {translate('label.contactPreferences.contactPrefDescText')}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col max-w-4xl mt-10">
        <div className="justify-between lg:w-1/2 lg:flex lg:align-center">
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
                  className="w-4 h-4 text-black border-gray-300 focus:ring-gray-700"
                />
                <label
                  htmlFor={`radio-btn-${idx}`}
                  className="block ml-3 text-sm font-medium text-black dark:text-black"
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
              <div className="flex items-center w-1/2 py-5" key={idx}>
                <input
                  name={`${idx}-input[]`}
                  defaultValue={box.key}
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded filter-input"
                />

                <label
                  htmlFor={`${idx}-input[]`}
                  onClick={() => handleCheckbox(box.key)}
                  className="relative text-sm text-gray-500 cursor-pointer filter-label"
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
                <span className='dark:text-black'>{box.label}</span>
              </div>
            )
          })}
        </div>
        <Formik initialValues={initialValues} onSubmit={handleDataSubmit}>
          {({ handleSubmit, isSubmitting }: any) => {
            return (
              <div className="flex mt-10 sm:flex-col1 w-60">
                {!hideSubmitBtn && <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="mt-4 nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:!bg-slate-900 hover:bg-slate-800 !text-slate-50 dark:text-black shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && translate('common.label.saveChangesText')}
                </Button>}
              </div>
            )
          }}
        </Formik>
      </div>
    </main>
  )
}
