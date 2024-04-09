// Base Imports
import { useCallback, useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import { useFormik } from 'formik'
import { useTranslation } from '@commerce/utils/use-translation'

// Other Imports
import {
  CONTACT_DETAILS_EMAIL,
  NEXT_CONTACT_US,
} from '@components/utils/constants'
import { LoadingDots, useUI } from '@components/ui'
import { AlertType } from '@framework/utils/enums'
import {
  CONTACT_US_DEFAULT_VALUES,
  CONTACT_US_FORM_ID,
  useContactUsFormSchema,
  useContactUsFields,
} from './config'

function ContactForm() {
  const { setAlert } = useUI()
  const translate = useTranslation()
  const ContactUsFormSchema = useContactUsFormSchema();
  const ContactUsFields = useContactUsFields();
  const [subjectOptions, setSubjectOptions] = useState<any>(null)
  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: CONTACT_US_DEFAULT_VALUES,
    validationSchema: ContactUsFormSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (values) {
        handleOnSubmit(values, () => {
          setSubmitting(false)
        })
      }
    },
  })

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  const resetForm = () => {
    formik.resetForm()
  }

  const handleOnSubmit = useCallback(async (formData: any, cb: any) => {
    try {
      const { data }: any = await axios.post(NEXT_CONTACT_US, {
        sendTo: CONTACT_DETAILS_EMAIL, // contact detail email
        ...formData,
      })
      if (cb) cb()
      if (!data?.success) {
        return setAlert({
          type: AlertType.ERROR,
          msg: translate('common.message.somethingWentWrongMsg'),
        })
      }

      resetForm()
      setAlert({
        type: AlertType.SUCCESS,
        msg: translate('common.message.formSubmitSuccessMsg')
      })
    } catch (error) {
      if (cb) cb()
      setAlert({
        type: AlertType.ERROR,
        mmsg: translate('common.message.somethingWentWrongMsg'),
      })
    }
  }, [])

  return (
    <div className="container max-w-5xl">
      <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {translate('label.contactUs.contactSalesText')}
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            {translate('label.contactUs.dummyText')}
          </p>
        </div>

        <form
          className="mx-auto mt-16 max-w-xl sm:mt-20"
          id={CONTACT_US_FORM_ID}
          onSubmit={formik?.handleSubmit}
        >
          <div>
            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {ContactUsFields?.slice(0, 4).map((field: any) => (
                <div className="mb-1 margin-bottom-form mt-5" key={field?.name}>
                  <label className="block text-sm font-semibold leading-6 text-gray-900">
                    {field?.label}
                  </label>
                  {field?.type === 'select' ? ( // Handle select element
                    <div className="custom-select relative">
                      <select
                        name={field?.name}
                        className={`w-full ${
                          formik.touched[field?.name] &&
                          formik.errors[field?.name]
                            ? 'border-brand-red'
                            : 'border-brand-blue'
                        } py-[10px] px-[16px] mt-1 rounded dark:text-black dark:bg-white`}
                        value={formik?.values[field?.name]}
                        onChange={formik?.handleChange}
                      >
                        {/* Add the default placeholder option */}
                        <option value="" disabled hidden>
                          {field?.placeholder}
                        </option>
                      </select>
                    </div>
                  ) : field?.type === 'textarea' ? ( // Handle textarea
                    <textarea
                      name={field?.name}
                      placeholder={field?.placeholder}
                      value={formik.values[field?.name]}
                      onChange={formik?.handleChange}
                      className={`border ${
                        formik.touched[field?.name] &&
                        formik.errors[field?.name] &&
                        'border-brand-red'
                      } block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    />
                  ) : (
                    // Handle other input fields
                    <input
                      name={field?.name}
                      placeholder={field?.placeholder}
                      type={field?.type}
                      value={formik.values[field?.name]}
                      onChange={formik?.handleChange}
                      className={`border ${
                        formik.touched[field?.name] &&
                        formik.errors[field?.name] &&
                        'border-brand-red'
                      } block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2`}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Render the remaining fields outside the div */}
            {ContactUsFields?.slice(4).map((field: any) => (
              <div className="mb-2 margin-bottom-form mt-6" key={field?.name}>
                <label className="block text-sm font-semibold leading-6 text-gray-900">
                  {field?.label}
                </label>
                {field?.type === 'select' ? ( // Handle select element
                  <div className="custom-select relative">
                    <select
                      name={field?.name}
                      className={`w-full ${
                        formik.touched[field?.name] &&
                        formik.errors[field?.name]
                          ? 'border-brand-red'
                          : 'border-brand-blue'
                      } py-[10px] px-[16px] mt-2 rounded dark:text-black dark:bg-white`}
                      value={formik?.values[field?.name]}
                      onChange={formik?.handleChange}
                    >
                      {/* Add the default placeholder option */}
                      <option value="" disabled hidden>
                        {field?.placeholder}
                      </option>
                    </select>
                  </div>
                ) : field?.type === 'textarea' ? ( // Handle textarea
                  <textarea
                    name={field?.name}
                    placeholder={field?.placeholder}
                    value={formik.values[field?.name]}
                    onChange={formik?.handleChange}
                    className={`border ${
                      formik.touched[field?.name] &&
                      formik.errors[field?.name] &&
                      'border-brand-red'
                    } block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                ) : (
                  // Handle other input fields
                  <input
                    name={field?.name}
                    placeholder={field?.placeholder}
                    type={field?.type}
                    value={formik.values[field?.name]}
                    onChange={formik?.handleChange}
                    className={`border ${
                      formik.touched[field?.name] &&
                      formik.errors[field?.name] &&
                      'border-brand-red'
                    } block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2.5`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buttons and submit logic here */}

          <div className="text-brand-blue font-16 font-normal">
            {translate('common.message.RequiredFieldMsg')}
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-black px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={formik?.isSubmitting}
            >
              {formik?.isSubmitting ? <LoadingDots /> : translate('common.label.submitText')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ContactForm
