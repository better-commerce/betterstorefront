// Base Imports
import React from 'react'

// Package Imports
import { Field } from 'formik'
// import MaskedInput from "react-text-mask";

// Component Imports
import FormField from './FormField'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'

const DEFAULT_TYPES = [
  'text',
  'number',
  'password',
  'card-expiry-text',
  'tel',
  'date',
]

interface IFloatingLabelFormFieldProps {
  readonly key: any
  readonly context: any
  readonly item: any
  readonly extraConfig?: any
  readonly lastChildInFloatingContainer?: any
  readonly lastChildInLabel?: any
}

const FloatingLabelFormField = (props: IFloatingLabelFormFieldProps) => {
  const {
    key,
    context,
    item,
    extraConfig,
    lastChildInFloatingContainer,
    lastChildInLabel,
  } = props

  const expiryMask = [/\d/, /\d/, '/', /\d/, /\d/]

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
      {DEFAULT_TYPES.includes(item?.type) && (
        <div className='w-full'>
        <div
          className={
            item?.floatingDivClassName
              ? item?.floatingDivClassName
              : 'floating-label'
          }
          key={key ?? item?.name}
        >
          {matchStrings(item?.type, 'card-expiry-text', true) ? (
            <Field
              name={item?.name}
              // render={({ field }: any) => (
              //     <MaskedInput
              //         {...field}
              //         disabled={context?.initialValues && item?.disabled ? true : false}
              //         required={item?.required}
              //         mask={expiryMask}
              //         placeholder={item?.placeholder ?? ""}
              //         type="text"
              //         onChange={context.handleChange}
              //         onBlur={context.handleBlur}
              //         className={item?.className}
              //     />
              // )}
            />
          ) : matchStrings(item?.type, 'date', true) ? (
            <Field
              type={item?.type}
              name={item?.name}
              className={item?.className}
              required={item?.required}
              min="1900-01-01"
              max="2100-01-01"
              value={
                context.values[item?.name] &&
                context.values[item?.name]?.length > 0
                  ? context.values[item?.name]
                  : ''
              }
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
          ) : (
            <Field
              className={item?.className}
              type={item?.type}
              name={item?.name}
              hidden={item?.hidden ?? false}
              placeholder={item?.placeholder ?? ''}
              disabled={context?.initialValues && item?.disabled ? true : false}
              required={item?.required}
              pattern={item?.pattern ? item?.pattern : null}
              min={item?.min ? item?.min : null}
              max={item?.max ? item?.max : null}
              maxlength={item?.max ? item?.max : null}
              step={item?.step ? item?.step : null}
              onChange={(e: any) => {
                if (extraConfig?.customHandler) {
                  extraConfig?.customHandler(e)
                }

                if (item.handleChange) {
                  return item.handleChange(e, item, context)
                }

                return context.handleChange(e)
              }}
            />
          )}

          <label
            hidden={item?.hidden ?? false}
            className={item?.labelClassName}
          >
            {item?.label}
            {item?.required && <span className="text-red-600">*</span>}

            {!lastChildInLabel && <>{lastChildInLabel}</>}
          </label>

          {lastChildInFloatingContainer && <>{lastChildInFloatingContainer}</>}
        </div>
        {(item?.required ||
            (item?.dependant && context.errors[item?.name])) &&
            getErrorLabel(context, item)}
        </div>
      )}

      {!item?.hidden && matchStrings(item?.name, 'saveCard', true) && (
        <FormField
          context={context}
          item={item}
          extraConfig={extraConfig}
          lastChildInFloatingContainer={lastChildInFloatingContainer}
          lastChildInLabel={lastChildInLabel}
        />
      )}
    </>
  )
}

export default FloatingLabelFormField
