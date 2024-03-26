// Base Imports
import React, { FormEvent, useRef } from 'react'

// Package Imports
import * as _ from 'lodash'
import { Formik, Form } from 'formik'

// Component Imports
import FormField from '@new-components/utils/FormField'
import AddressFormField from '@new-components/utils/AddressFormField'

// Other Imports
import {
  findByFieldName,
  pincodeLookup,
  submittingClassName,
} from '@framework/utils/app-util'
import { AddressPageAction } from '@new-components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import { NEW_ADDRESS_FORM_FIELDS } from './NewAddressModal'
import SubmitButton from '@components/common/SubmitButton'
import { IFormProps } from 'framework/contracts/IFormProps'
import { INewAddressFormProps } from 'framework/contracts/address/INewAddressFormProps'
import { useTranslation } from '@commerce/utils/use-translation'

const NewAddressForm = (props: IFormProps & INewAddressFormProps) => {
  const translate = useTranslation()
  const newAddressFormRef: any = useRef(null)
  const {
    submitState,
    formId,
    schema,
    initialValues = null,
    defaultValues,
    formFields,
    btnTitle,
    countries,
    isRegisterAsGuestUser,
    onSubmit = () => {},
  } = props
  const initState = defaultValues
    ? Object.keys(defaultValues).length
      ? defaultValues
      : initialValues
    : initialValues

  const onLookup = async (target: any) => {
    //const target: any = ev?.target;
    if (target?.name === NEW_ADDRESS_FORM_FIELDS[0]?.name) {
      const postcode = target?.value
      if (postcode) {
        const pincodeLookupResult = await pincodeLookup(postcode)
        // console.log(pincodeLookupResult)

        if (pincodeLookupResult?.length) {
          const lookup = pincodeLookupResult?.find((x: any) => matchStrings(x?.pin, postcode, true) )
          return lookup
        }
      }
    }
    return null
  }

  return (
    <Formik
      innerRef={newAddressFormRef}
      validationSchema={schema}
      initialValues={initState}
      onSubmit={(values) => {
        const payload = {
          ...values,
        }
        onSubmit(payload)
      }}
    >
      {(context) => {
        const {
          errors,
          touched,
          handleSubmit,
          values,
          handleChange,
          setValues,
          handleBlur,
          setFieldValue,
        } = context
        // form.setTouched({...form.touched,[field.name]: true });
        return (
          <Form id={formId} onSubmit={handleSubmit}>
            <div className="w-full p-4">
              <h2 className="text-base font-bold dark:text-black">{translate('common.label.addressText')}</h2>
              <div className="w-full mt-1 add-form-section">
                {(formFields?.length
                  ? Array.from<any>([]).concat([
                      findByFieldName(formFields, 'postCode'),
                    ])
                  : []
                )?.map((item: any, idx: number) => (
                  <AddressFormField
                    key={idx}
                    context={context}
                    item={item}
                    // extraConfig={{
                    //   customHandler: async (ev: any) => {
                    //     const target = ev?.target
                    //     setTimeout(async () => {
                    //       setFieldValue(NEW_ADDRESS_FORM_FIELDS[1]?.name, '')
                    //       setFieldValue(NEW_ADDRESS_FORM_FIELDS[2]?.name, '')

                    //       const lookup = await onLookup(target)
                    //       if (lookup) {
                    //         setFieldValue(
                    //           NEW_ADDRESS_FORM_FIELDS[1]?.name,
                    //           lookup?.city
                    //         )
                    //         setFieldValue(
                    //           NEW_ADDRESS_FORM_FIELDS[2]?.name,
                    //           lookup?.state
                    //         )
                    //       }
                    //     }, 200)
                    //   },
                    // }}
                  />
                ))}
                <div className="grid w-full grid-cols-2 overflow-hidden gap-x-4">
                  {(formFields?.length
                    ? Array.from<any>([]).concat([
                        findByFieldName(formFields, 'city'),
                        findByFieldName(formFields, 'state'),
                      ])
                    : []
                  )?.map((item: any, idx: number) => (
                    <AddressFormField key={idx} context={context} item={item} />
                  ))}
                </div>
                {(formFields?.length
                  ? Array.from<any>([]).concat([
                      findByFieldName(formFields, 'address1'),
                      findByFieldName(formFields, 'address2'),
                      findByFieldName(formFields, 'address3'),
                    ])
                  : []
                )?.map((item: any, idx: number) => (
                  <AddressFormField key={idx} context={context} item={item} />
                ))}
               { <AddressFormField context={context} item = {{...findByFieldName(formFields, "country"),options:countries}} /> }
                {!isRegisterAsGuestUser && <AddressFormField context={context} item={findByFieldName(formFields, 'useAsDefault')} /> }
              </div>
            </div>
            <div className="w-full p-4 pt-0">
              <h2 className="text-base font-bold dark:text-black">{translate('label.contactPreferences.contactPreferencesHeadingText')}</h2>
              <p className="mt-1 mb-2 text-xs text-brown-light">
                {translate('label.checkout.contactInfoText')} </p>
              <div className="w-full mt-1 add-form-section">
              <div className="grid w-full grid-cols-2 overflow-hidden gap-x-4">
                {(formFields?.length
                  ? Array.from<any>([]).concat([
                    findByFieldName(formFields, 'firstName'),
                    findByFieldName(formFields, 'lastName'),
                    ])
                  : []
                )?.map((item: any, idx: number) => (
                  <AddressFormField key={idx} context={context} item={item} />
                ))}
              </div>
              {
                <AddressFormField context={context} item={findByFieldName(formFields, 'mobileNumber')} />
              }
                {
                  <AddressFormField
                    context={context}
                    item={findByFieldName(formFields, 'whtsappUpdated')}
                  />
                }
                {!isRegisterAsGuestUser && (formFields?.length
                  ? Array.from<any>([]).concat([
                      findByFieldName(formFields, 'categoryName'),
                    ])
                  : []
                )?.map((item: any, idx: number) => (
                  <div key={item?.name} className="w-full py-4 address-type">
                    <FormField context={context} item={item} />
                  </div>
                ))}

                {matchStrings(values?.categoryName, 'Other', true) && (
                  <>
                    {(formFields?.length
                      ? Array.from<any>([]).concat([
                          findByFieldName(formFields, 'otherAddressType'),
                        ])
                      : []
                    )?.map((item: any, idx: number) => (
                      <AddressFormField
                        key={idx}
                        context={context}
                        item={item}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 px-4 py-4 mt-2 bg-white chk-btn sm:px-4">
              {/*
                            onClick={() => {
                                    newAddressFormRef?.current?.validateForm().then((errors: any) => {
                                        if (!errors || _.isEmpty(errors)) {
                                            newAddressFormRef?.current?.submitForm();
                                        }
                                    });
                                }}
                            */}

              <SubmitButton
                cssClass="w-full flex items-center btn-basic-property justify-center -mr-0.5 bg-header-color border-2 border-black hover:text-white hover:border-gray-900 btn btn-primary"
                submitState={submitState}
                source={AddressPageAction.SAVE}
              >
                <>
                  {btnTitle}
                  <span className="ml-2">
                    <i className="sprite-icon sprite-right-white-arrow"></i>
                  </span>
                </>
              </SubmitButton>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default NewAddressForm
