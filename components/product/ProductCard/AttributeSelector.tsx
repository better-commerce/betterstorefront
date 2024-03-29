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
    <div className="mb-1 border-b border-gray-200">
      {attr.fieldValues.map((item: any, idx: number) => {
        return (
          <Link key={idx} href={link || '#'} passHref>
            <span
              key={idx}
              onMouseEnter={() => onChange(item, 'enter')}
              onMouseLeave={() => onChange(item, 'leave')}
              className="inline-block w-5 h-5 mt-2 mr-1 border border-gray-200 rounded-full shadow-md sm:h-5 sm:w-5 sm:mr-2 drop-shadow-md"
              style={{ backgroundColor: item.fieldValue }}
            ></span>
            <span className='sr-only'>{item.fieldValue}</span>
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
