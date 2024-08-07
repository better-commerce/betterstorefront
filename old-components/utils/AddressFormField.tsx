// Base Imports
import React from 'react'

// Component Imports
import FormField from './FormField'
import FloatingLabelFormField from './FloatingLabelFormField'

// Other Imports
import { matchStrings } from '@framework/utils/parse-util'

const DEFAULT_TYPES = ['text', 'number', 'tel']

const AddressFormField = ({ key, context, item, extraConfig }: any) => {
  return (
    <>
      {DEFAULT_TYPES.includes(item?.type) && (
        <FloatingLabelFormField
          key={key}
          context={context}
          item={item}
          extraConfig={extraConfig}
        />
      )}
      
      {matchStrings(item?.name, 'country', true) &&(
        <div className="w-min-full py-4 pb-0 select">
          <FormField
            context={context}
            item={item}
            extraConfig={extraConfig}
          />
        </div>
      )}

      {matchStrings(item?.name, 'useAsDefault', true) && (
        <div className="w-full py-4 pb-0 checkbox">
          <div className="checkbox-c">
            <FormField
              context={context}
              item={item}
              extraConfig={extraConfig}
            />
          </div>
        </div>
      )}
      {matchStrings(item?.name, 'whtsappUpdated', true) && (
        <div className="w-full py-4 pb-0 checkbox">
          <div className="checkbox-c">
            <FormField
              context={context}
              item={item}
              extraConfig={extraConfig}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AddressFormField
