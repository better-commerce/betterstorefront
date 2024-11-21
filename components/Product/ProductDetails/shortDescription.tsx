import React, { useEffect, useState } from 'react'

const ShortDescription = ({ description }: any) => {
  const [combinedParagraph, setCombinedParagraph] = useState('')
  useEffect(() => {
    const combinedText = combineLiTags(description)
    setCombinedParagraph(combinedText)
  }, [description])
  const combineLiTags = (rawHTML: any) => {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = rawHTML

    const liTags = tempElement.querySelectorAll('li')
    let combinedText = ''
    if (liTags?.length) {
      liTags.forEach((liTag) => {
        combinedText += liTag.textContent + ' ' // Add space between list items
      })
    } else {
      const pTag = tempElement.querySelector('p')
      combinedText += pTag?.textContent
    }

    return combinedText.trim()
  }
  return (
    <>
      {/* <div
          className="mb-4 text-xs font-normal custom-html"
          dangerouslySetInnerHTML={{
            __html: description
          }}
        /> */}
      <p className="mb-4 text-sm dark:text-black">{description}</p>
    </>
  )
}

export default ShortDescription
