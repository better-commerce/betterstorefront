import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useDetailsFormConfig, useSchema } from './configs/details'
import { useUI } from '@components/ui/context'
import { useHandleSubmit } from './common'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { Button } from '@components/ui'
import { findByFieldName } from '@framework/utils/app-util'
import FormField from '@components/utils/FormField'
import { Messages } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

export default function MyDetails() {
  const handleSubmit = useHandleSubmit();
  const translate = useTranslation();
  const schema:any = useSchema();
  const formConfig = useDetailsFormConfig();
  const [title, setTitle] = useState(translate('label.myAccount.myDetailsHeadingText'))
  const { user, setUser, changeMyAccountTab } = useUI()
  const { CustomerUpdated } = EVENTS_MAP.EVENT_TYPES

  const ContactNumberLenCheck: any =  schema?.fields?.mobile?.tests?.find((t:any) => t?.OPTIONS?.name === 'max').OPTIONS?.params?.max;

  const formikHandleChange = (e: any, handleFunction: any) => {
    if (e.target.name === 'telephone' || e.target.name === 'mobile') {
      //Regex to check if the value consists of an alphabet or a character
      e.target.value = e.target.value
        ? e.target.value.replace(
          Messages.Validations.RegularExpressions.CHARACTERS_AND_ALPHABETS,
          ''
        )
        : ''
      if (e.target.value.length <= ContactNumberLenCheck) {
        handleFunction(e)
      }
    } else {
      handleFunction(e)
    }
  }
  const initialValues = {
    email: user?.email,
    firstName: user?.firstName,
    lastName: user?.lastName,
    mobile: user?.mobile,
    telephone: user?.telephone,
    gender: user?.gender
      ? user?.gender
      : findByFieldName(formConfig, 'gender')?.options?.length
        ? ''
        : '',
  }

  const handleDataSubmit = async (values: any) => {
    await handleSubmit(values, user, setUser, setTitle)
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

  useEffect(()=>{
    changeMyAccountTab(translate('label.myAccount.myDetailsHeadingText'))
  },[])

  return (
    <main className="pb-6 space-y-5 sm:space-y-12 sm:pb-10">
      <div className=''>
        <h1 className="text-2xl font-semibold sm:text-3xl dark:text-black">
          Account information
        </h1>
        <p className="mt-2 text-sm font-normal text-black dark:text-black">
          {translate('label.myAccount.editYourDetailsText')}
        </p>
      </div>
      <div className="mx-2">
        <div className="max-w-4xl lg:mx-12 xs:ml-6">
          <div className="sm:pt-5 lg:px-0 sm:px-0">
          </div>
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className="flex items-start flex-shrink-0 hidden sm:block">
            {/* AVATAR */}
            <div className="relative flex overflow-hidden border rounded-full">
              <img
                src="/assets/user-avatar.png"
                alt="avatar"
                width={128}
                height={128}
                className="z-0 object-cover w-20 h-20 rounded-full sm:w-32 sm:h-32"
              />
            </div>
          </div>
          <div className='flex-grow max-w-3xl sm:mt-10 sm:space-y-6 md:mt-0 md:pl-16'>
            <Formik
              enableReinitialize={true}
              validationSchema={schema}
              initialValues={initialValues}
              onSubmit={handleDataSubmit}
            >
              {(context) => {
                const {
                  errors,
                  touched,
                  handleSubmit,
                  values,
                  handleChange,
                  isSubmitting,
                }: any = context
                return (
                  <Form className="flex-grow w-full max-w-3xl space-y-4 font-normal sm:mt-10 sm:space-y-6 md:mt-0">
                    {formConfig?.map((formItem: any, idx: number) => {
                      return (
                        formItem.type !== 'singleSelectButtonGroup' && (
                          <div key={`${formItem.label}_${idx}`}>
                            <label className="text-base font-medium nc-Label text-neutral-900 dark:text-neutral-900 ">
                              {formItem.label}
                            </label>
                            <div className="mt-1.5 flex icon-input-form">
                              <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-50 text-neutral-500 dark:text-neutral-500 text-sm">
                                <i className={`${formItem.placeholder} text-2xl las`}></i>
                              </span>
                              <Field
                                key={idx}
                                name={formItem.name}
                                placeholder={formItem.placeholder}
                                onChange={(e: any) =>
                                  formikHandleChange(e, handleChange)
                                }
                                value={values[formItem.name]}
                                type={formItem.type}
                                maxLength={formItem.maxLength}
                                className="block !rounded-l-none mt-0 w-full border outline-none border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-white dark:text-black disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl text-sm font-normal h-11 px-4 py-3"
                              />

                              {errors[formItem.name] && touched[formItem.name] && (
                                <div className="mb-2 text-xs text-red-400">
                                  {errors[formItem.name]}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )
                    })}
                    {(formConfig?.length
                      ? Array.from<any>([]).concat([
                        findByFieldName(formConfig, 'gender'),
                      ])
                      : []
                    )?.map((item: any, idx: number) => (
                      <div
                        key={item?.name}
                        className="w-full sm:py-4 address-type"
                      >
                        {<FormField context={context} item={item} />}
                      </div>
                    ))}
                    <div className="flex sm:mt-10 sm:flex-col1 sm:w-48">
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:!bg-black hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-50 dark:!text-white shadow-xl  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 !w-full"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {!isSubmitting && translate('common.label.saveChangesText')}
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>

      </div>
    </main>
  )
}
