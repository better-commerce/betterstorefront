// Base Imports
import React, { memo } from 'react'

// Package Imports
import { uniqBy } from 'lodash'

// Other Imports
import { useContentSnippet } from '@framework'

const ContentSnippet: React.FC<React.PropsWithChildren<any>> = (props: any) => {
  const { refs } = props
  let { snippets } = props
  snippets = uniqBy(snippets, 'name') // to prevent duplicity
  useContentSnippet(snippets, refs)
  return <></>
}

export default memo(ContentSnippet)
