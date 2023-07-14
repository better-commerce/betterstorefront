export interface IFormProps {
  readonly formId: string
  readonly schema: any
  readonly initialValues?: any
  readonly defaultValues?: any
  readonly formFields: Array<any>
  onSubmit?: any
}
