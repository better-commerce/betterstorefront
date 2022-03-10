/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'

import { BlockTitle } from '@components/contentful/block-title'
import { renderRichText } from '@lib/contentful/rich-text'
import { TypeComponent_text } from '@lib/contentful/types'

export function Text({ fields }: TypeComponent_text) {
  const { title, text } = fields

  return (
    <>
      {title ? <BlockTitle title={title} /> : null}
      {renderRichText(text as any)}
    </>
  )
}
