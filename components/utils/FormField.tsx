// Base Imports
import React from 'react'

// Package Imports
import { Field } from 'formik'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import classNames from 'classnames'

interface IFormFieldProps {
  readonly context: any
  readonly item: any
  readonly extraConfig?: any
  readonly lastChildInFloatingContainer?: any
  readonly lastChildInLabel?: any
}

const FormField = (props: IFormFieldProps) => {
  const {
    context,
    item,
    extraConfig,
    lastChildInFloatingContainer,
    lastChildInLabel,
  } = props

  const showLabel = item?.showLabel === undefined ? true : item?.showLabel

  const getErrorLabel = (context: any, item: any, ignoreTouched = false) => {
    if (!ignoreTouched) {
      return context.errors[item?.name] && context.touched[item?.name] ? (
        <div className="text-sm text-red-400">{context.errors[item?.name]}</div>
      ) : null
    }

    return context.errors[item?.name] ? (
      <div className="text-sm text-red-400">{context.errors[item?.name]}</div>
    ) : null
  }

  return (
    <>
      {['text', 'number', 'password', 'tel'].includes(item?.type) && (
        <>
          <Field
            className={item?.className}
            type={item?.type}
            name={item?.name}
            placeholder={item?.placeholder ?? ''}
            disabled={context?.initialValues && item?.disabled ? true : false}
            required={item?.required}
            pattern={item?.pattern ? item?.pattern : null}
            min={item?.min ? item?.min : null}
            max={item?.max ? item?.max : null}
            maxlength={item?.max ? item?.max : null}
            minlength={item?.min ? item?.min : null}
            step={item?.step ? item?.step : null}
            onChange={(e: any) => {
              if (item.handleChange) {
                return item.handleChange(e, item, context)
              }

              if (extraConfig?.customHandler) {
                extraConfig?.customHandler(e)
              }
              return context.handleChange(e)
            }}
          />

          {showLabel && (
            <label className={item?.labelClassName}>
              {item?.label}
              {item?.required && <span className="text-red-600">*</span>}

              {!lastChildInLabel && <>{lastChildInLabel}</>}
            </label>
          )}

          {item?.required && getErrorLabel(context, item)}
        </>
      )}
      {matchStrings(item?.type, 'checkbox', true) && (
        <>
          <Field
            id={item?.htmlFor}
            className={item?.className}
            type={item?.type}
            name={item?.name}
            onChange={(e: any) => {
              item?.onChange
                ? item?.onChange(e, item, context)
                : context?.handleChange(e)
            }}
            checked={
              item?.checked
                ? item?.checked(context)
                : context?.values[item?.name]
            }
            disabled={context.initialValues && item?.disabled ? true : false}
            required={item?.required}
          />

          {showLabel && (
            <label className={item?.labelClassName} htmlFor={item?.htmlFor}>
              {item?.label}
              {item?.required && <span className="text-red-600">*</span>}

              {lastChildInLabel && <>{lastChildInLabel}</>}
            </label>
          )}

          {!lastChildInFloatingContainer && <>{lastChildInFloatingContainer}</>}

          {item?.required && getErrorLabel(context, item)}
        </>
      )}

      {matchStrings(item?.type, 'singleSelectButtonGroup', true) && (
        <>
          <h3 className={item?.labelClassName}>
            {item?.label}
            {item?.required && <span className="text-red-600">*</span>}
          </h3>
          <Field name={item?.name} disabled={item?.disabled}>
            {({ field, meta, form: { setFieldValue } }: any) => {
              return (
                <>
                  {item?.options?.map((option: any, idx: number) => (
                    <a
                      key={idx}
                      {...field}
                      href="javascript: void(0);"
                      className={
                        idx == item?.options?.length - 1
                          ? classNames(
                              item?.lastOptionClassName,
                              idx === item?.activeOptionIndex ? ' active' : ''
                            )
                          : classNames(
                              item?.optionClassName,
                              idx === item?.activeOptionIndex ? ' active' : ''
                            )
                      }
                      onClick={(e: any) => {
                        setFieldValue(item?.name, option?.value)
                      }}
                    >
                      <input
                        className="main-custom-check"
                        id={option?.label}
                        name="address-type"
                        type="radio"
                        defaultChecked={
                          idx === item?.activeOptionIndex ||
                          context?.values[item?.name] === option?.value
                            ? true
                            : false
                        }
                      />
                      <label
                        className="text-sm main-custom-check-label flex"
                        htmlFor={option?.label}
                        title="Smooth Payments"
                      >
                        {option?.label}
                      </label>
                    </a>
                  ))}

                  {item?.required && getErrorLabel(context, item, true)}
                </>
              )
            }}
          </Field>
        </>
      )}
    </>
  )
}

export default FormField
