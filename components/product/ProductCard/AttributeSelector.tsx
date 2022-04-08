import { attr } from 'dom7'
import Link from 'next/link'

interface Attribute {
  fieldCode: string
  fieldName: string
  fieldValues: []
}

interface Attributes {
  attributes: [Attribute]
  onChange: any
  link?: string
}

const ColorSelector = ({ attr, onChange, link }: any) => {
  return (
    <div>
      {attr.fieldValues.map((item: any, idx: number) => {
        return (
          <Link key={idx} href={link || '#'} passHref>
            <a
              key={idx}
              onMouseEnter={() => onChange(item, 'enter')}
              onMouseLeave={() => onChange(item, 'leave')}
              className="sm:h-8 sm:w-8 h-5 w-5 inline-block rounded-xs sm:mr-2 mr-1 mt-2 border border-gray-300"
              style={{ backgroundColor: item.fieldValue }}
            />
          </Link>
        )
      })}
    </div>
  )
}

ColorSelector.displayName = 'ColorSelector'

const getAttributeComponent = (type: string) => {
  switch (type) {
    case 'global.colour':
      return (props: any) => <ColorSelector {...props} />
    default:
      return () => null
  }
}

export default function AttributeSelector({
  attributes,
  onChange = {},
  link,
}: Attributes) {
  return (
    <>
      {attributes.map((attr: Attribute, idx: number) => {
        const Component = getAttributeComponent(attr.fieldCode)
        // return <>{({ attr, onChange, link })}</>
        return (
          <Component attr={attr} key={idx} onChange={onChange} link={link} />
        )
      })}
    </>
  )
}
