import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

import { useAddCompanyUserConfig  } from '@components/account/AddCompanyUser/config'
import Button from '@components/ui/Button'
import { useTranslation } from '@commerce/utils/use-translation'
import { Checkbox } from '@components/account/Address'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { NEXT_B2B_GET_COMPANY_HIERARCHY_BY_PARENT_ID } from '@components/utils/constants'

const formInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  zone: '',
  branch: '',
  country: ''
}

const COMPONENTS_MAP: any = {
  CustomCheckbox: (props: any) => <Checkbox {...props} />,
}

export default function AddCompanyUserForm({ type = 'addCompanyUser', hierarchy = [], isLoginSidebarOpen, onSubmit = () => {}, btnText = 'Add New User' }: any) {
  const translate = useTranslation()
  const addUserSchema = Yup.object({
    firstName: Yup.string().required(translate('label.myAccount.rfq.firstNameRequired')),
    lastName: Yup.string().required(translate('label.myAccount.rfq.lastNameRequired')),
    email: Yup.string().required(translate('label.myAccount.rfq.emailRequired')).email(translate('label.myAccount.rfq.emailInvalid')),
    password: Yup.string().min(8).max(24).required(translate('common.message.password.passwordRequiredMsg')),
    confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref('password')],
      translate('label.myAccount.passwordMustMatchText')
    )
    .required(translate('common.message.password.confirmRequiredMsg')),
    role: Yup.string().required(translate('label.myAccount.roleRequiredText')).notOneOf([''], translate('label.myAccount.selectRoleText')),
    zone: Yup.string().required(translate('label.myAccount.zoneRequiredText')).notOneOf([''], translate('label.myAccount.selectZoneText')),
    branch: Yup.string().required(translate('label.myAccount.branchRequiredText')).notOneOf([''], translate('label.myAccount.selectBranchText')),
    country: Yup.string().required(translate('label.myAccount.countryRequiredText')).notOneOf([''], translate('label.myAccount.selectCountryText')),
  })

  const addCompanyUserConfig = useAddCompanyUserConfig(hierarchy)

  const VALUES_MAP: any = {
    addCompanyUser: {
      schema: addUserSchema,
      initialValues: formInitialValues,
      config: addCompanyUserConfig,
    },
  }
  const { config, initialValues, schema } = VALUES_MAP[type]

  return (
    <Formik validationSchema={schema} initialValues={initialValues} onSubmit={(values, actions) => {onSubmit(values, () => { actions.setSubmitting(false)})}} >
      {({ errors, touched, values, handleChange, isSubmitting }: any) => {
        const [branchOptions, setBranchOptions] = useState([])
        const [loadingBranches, setLoadingBranches] = useState(false)
        const fetchCompanyHierarchyByParentId = async () => {
          setLoadingBranches(true)
          try {
            const selectedZone = hierarchy.find((item: any) => (item.id === values.zone))
            const { data : branchList } = await axios.post(NEXT_B2B_GET_COMPANY_HIERARCHY_BY_PARENT_ID, {
              companyId: selectedZone.companyId,
              parentId: selectedZone.parentId
            })

            if (branchList?.length > 0) {
              const options = branchList.map((item: any) => ({ label: item.name, value: item.id }))
              setBranchOptions(options)
            } else {
              setBranchOptions([])
            }
            setLoadingBranches(false)
          } catch (error) {
            setLoadingBranches(false)
            setBranchOptions([])
          }
        }

        useEffect(() => {
          if (values.zone) {
            fetchCompanyHierarchyByParentId()
          }
        }, [values.zone])
        return (
          <div  className={`flex flex-col items-center justify-center w-full lg:px-0 px-5 ${!isLoginSidebarOpen && `px-5`}`} >
            <Form className={`w-full font-semibold ${!isLoginSidebarOpen && `sm:w-full` }`} >
              {config?.map((formItem: any, idx: number) => {
                return (
                  <>
                    <div key={`${formItem.key}_${idx}`} className={`form-field mb-4 ${idx + 1}`}>
                      {formItem?.customComponent ? ( COMPONENTS_MAP[formItem?.customComponent]({ formItem, values, handleChange, }))
                       : !formItem?.show ||
                        (formItem?.show && formItem?.show(values)) ? (
                        <>
                          <label className="text-neutral-800 dark:text-neutral-200">
                             {' '} {formItem?.label}{' '} {schema.fields[formItem.key]?.exclusiveTests?.required && (
                              <span className="text-red-500"> *</span>
                              )}
                          </label>
                          {formItem?.type === 'select' ? (
                              formItem.key === 'branch' ? (
                                <Field as="select" name={formItem?.key} onChange={handleChange} value={values[formItem?.key]} className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11" disabled={formItem.key === 'branch' && loadingBranches}>
                                  <option value="" disabled>{formItem?.placeholder}</option>
                                  {branchOptions?.map((option: any) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </Field>
                              ) : (
                                <Field as="select" name={formItem?.key} onChange={handleChange} value={values[formItem?.key]} className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11" >
                                  <option value="" disabled> {formItem?.placeholder} </option>
                                  {formItem?.options?.map((option: any) => (
                                    <option key={option?.value} value={option?.value}> {option?.label} </option>
                                  ))}
                                </Field>
                            )
                          ) : (
                            <Field key={idx} name={formItem.key} placeholder={formItem.placeholder} onChange={handleChange} value={values[formItem.key]} type={formItem.type} className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11"  />
                          )}
                          {errors[formItem?.key] && touched[formItem?.key] ? (
                            <div className="mb-2 font-medium text-red-400 font-12">
                              {errors[formItem?.key]}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </>
                )
              })}
              <div
                className={`flex items-center justify-center !w-full my-5 ${ !isLoginSidebarOpen && `md:w-1/2`}`} >
                <Button type="submit" className="w-full border border-black btn btn-c btn-primary rounded-2xl" loading={isSubmitting} disabled={isSubmitting} >
                  {!isSubmitting && btnText}
                </Button>
              </div>
            </Form>
          </div>
        )
      }}
    </Formik>
  )
}
