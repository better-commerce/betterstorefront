import cn from 'classnames'
import {
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import SwiperCore, { Navigation } from 'swiper'
import {
  GENERAL_ENGRAVING_PERSONALIZE_BOTTLE,
  GENERAL_PERSONALISATION,
  GENERAL_PERSONALISATION_READONLY,
  IMG_PLACEHOLDER,
  SELECT_IMAGE_ERROR,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'


type ProductPersonaliserImage = {
  url: string
  position: string
  coordinates: string
  fontSize: number
}

type ProductPersonaliserProps = {
  images: ProductPersonaliserImage[]
  canvasWidth: number
  canvasHeight: number
  characters: string
  maxTextLength: number
  submitText: any
  engravingPrice: any
  onSubmit: ({
    message,
    imageUrl,
  }: {
    message: string
    imageUrl: string
  }) => void
  readOnly: false
  values?: any
  product: any
}

SwiperCore.use([Navigation])

export const ProductPersonaliser: FC<ProductPersonaliserProps> = ({
  canvasWidth,
  canvasHeight,
  characters,
  maxTextLength,
  submitText,
  onSubmit,
  readOnly,
  product,
  engravingPrice,
}: ProductPersonaliserProps) => {
  const translate = useTranslation()
  const [text, setText] = useState<any>([])
  const [isImageCLick, setIsImageCLick] = useState<any>(false)
  const [selectedImage, setSelectedImage] = useState<any>('')
  const [counter, setCounter] = useState<any>(0)
  const [imageUrl, setImageUrl] = useState<any>('')
  const [showError, setShowError] = useState<any>(false)
  const [isFocus, setIsFocus] = useState<any>(false)
  const [characterClicked, setCharacterClicked] = useState<any>('')

  useEffect(() => {
    if (readOnly) {
      product.children?.map((val: any, key: number) => {
        setText(val.customInfo1 || 'SAMPLE')
        setImageUrl(val.customInfo2 || val.image)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let prodpersonaliserURL: any = ''
  prodpersonaliserURL = product.image ? product.image : ''

  const maxTextLengthReached = counter >= maxTextLength

  const addCharacter = useCallback(
    (character: string) => {
      setIsFocus(true)
      const newText = `${text}${character}`

      if (maxTextLengthReached) {
        throw new Error('Text exceeds the max characters.')
      }

      setText(newText)
    },
    [text, maxTextLengthReached]
  )

  function addCharacterFromInput(e: any) {
    setIsFocus(true)
    const newTextFromIp = e.target.value
    newTextFromIp.toUpperCase()
    // const newText = `${text}${newTextFromIp}`
    if (counter < 7) {
      setText(newTextFromIp)
    }
  }

  const removeCharacter = useCallback(() => {
    if (text.length > 0) {
      const chars = text.split('')
      let re = new RegExp(/^[A-Z0-9]+$/i)
      if (re.test(text[text.length - 1])) {
        chars.pop()
        setCounter(counter - 1)
      } else {
        chars.pop()
        chars.pop()
        setCounter(counter - 1)
      }

      setText(chars.join(''))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const clearText = useCallback(() => {
    setIsFocus(false)
    setCounter(0)
    setText('')
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedImage && product.images?.length > 1) {
      setShowError(true)
      return
    }
    onSubmit({
      message: text,
      imageUrl: product?.images?.length > 1 ? selectedImage : product.images[0],
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSubmit, text, selectedImage])

  // function to handle selected Image
  function handleImageCLick(e: any) {
    setIsImageCLick(true)
    setSelectedImage(e.target.src)
  }

  useEffect(() => {
    if (counter < 7) {
      setCounter(text.length)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  useEffect(() => {
    setShowError(false)
  }, [selectedImage])

  return (
    <div className="flex justify-between w-full gap-6">
      {readOnly ? (
        <>
          <div className="mb-2 mob-engrav-img iphoneXR:p-1 s20:p-2">
            <img
              src={generateUri(imageUrl,'h=180&w=200') || ''}
              width={200}
              height={180}
              alt={product.name || 'product'}
              className="mx-auto"
            />
          </div>
          <div className="px-4 m-auto xsm:p-3">
            <p className="mb-3 text-black xsm:text-sm xsm:flex dark:text-black">
              <span className="text-2xl text-gray-500">{translate('label.product.messageText')}</span> :{' '}
              <span className="text-2xl">{text}</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            style={{ minWidth: canvasWidth, minHeight: canvasHeight }}
            className="flex flex-row mb-4 mob-engrav-img iphoneXR:p-1 s20:p-2"
          >
            {product?.images?.length > 1 ? (
              <div className="flex flex-col h-full mx-auto w-96">
                {!selectedImage ? (
                  <p className="my-1 font-medium text-center text-black">
                    {translate('label.product.selectToPersonalizeText')}
                  </p>
                ) : (
                  <p className="my-1 font-medium text-center text-black">
                   {translate('label.product.greatSelectionText')}
                  </p>
                )}
                <Swiper
                  slidesPerView={1.1}
                  navigation={true}
                  loop={true}
                  breakpoints={{
                    640: { slidesPerView: 1.1 },
                    768: { slidesPerView: 1.1 },
                    1024: { slidesPerView: 1.1 },
                  }}
                >
                  {product?.images?.map((val: any, valId: number) => {
                    return (
                      <SwiperSlide
                        className={cn(
                          'py-0 border border-grey-40',
                          isImageCLick && ''
                        )}
                        key={valId}
                      >
                        <img
                          src={
                            generateUri(val.image, 'h=500&fm=webp') ||
                            IMG_PLACEHOLDER
                          }
                          width={400}
                          height={500}
                          alt={val.image  || 'product'}
                          className={cn(
                            'max-h-md w-full',
                            !!selectedImage &&
                              selectedImage === val.image &&
                              'border-2 border-blue'
                          )}
                          onClick={(e: any) => {
                            handleImageCLick(e)
                          }}
                        />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            ) : (
              <img
                src={
                  generateUri(product.images[0].image, 'h=500&fm=webp') ||
                  IMG_PLACEHOLDER
                }
                width={400}
                height={500}
                title="Engraving"
                alt="Engraving"
                className="w-full max-h-md"
              />
            )}
          </div>

          <div>
            {readOnly ? (
              <p className="flex flex-col mx-auto mt-6 text-4xl font-bold text-center text-black">
                {GENERAL_PERSONALISATION_READONLY}
              </p>
            ) : (
              <div className="flex flex-col py-0 mx-auto">
                <p className="mx-auto text-4xl font-bold text-center text-black">
                  {GENERAL_PERSONALISATION}
                </p>
                <span className="w-3/4 py-2 m-auto text-center text-gray-500 text-md">
                  {GENERAL_ENGRAVING_PERSONALIZE_BOTTLE} {engravingPrice}{' '}
                </span>
              </div>
            )}
            <div
              className={cn(
                'pl-2 mb-2 text-gray-500 font-light text-sm rounded-xl h-14',
                isFocus ? 'border-2 border-blue' : 'box-border border-2'
              )}
            >
              <span className="pl-2 text-xs font-light text-gray-500">
                {translate('label.product.productPersonalisation.yourEngravingText')}
              </span>
              <input
                className="block w-3/4 pb-2 m-auto font-mono text-sm text-center text-black border-none shadow-none outline-none focus:shadow-outline focus:outline-none"
                onChange={(e) => {
                  addCharacterFromInput(e)
                }}
                value={text}
              />
            </div>
            <div className="w-full max-w-full pr-6 ml-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-700">
                {counter} / {maxTextLength} {translate('label.product.productPersonalisation.charactersText')}
              </span>
              <div
                className={cn(
                  'mt-2 xsm: w-full max-w-full grid grid-flow-row grid-cols-9 md:grid-cols-9 lg:grid-cols-9',
                  !!maxTextLengthReached && 'opacity-30'
                )}
              >
                {characters.split('').map((character) => (
                  <button
                    type="button"
                    disabled={maxTextLengthReached}
                    key={character}
                    className={cn(
                      'p-2 xsm:p-1 xsm:gap-x-2 text-xl leading-none border-accent-2 border-b border-b-gray-100 border-r border-t border-l border-r-gray-100 border-t-gray-100 border-l-gray-100 text-black dark:text-gray-700 mob-btn-font',
                      maxTextLengthReached
                        ? 'cursor-not-allowed'
                        : 'hover:bg-accent-2 dark:hover:bg-accent-7'
                    )}
                    onClick={() => {
                      setCounter(counter + 1)
                      addCharacter(character)
                      setCharacterClicked(character)
                    }}
                  >
                    {character}
                  </button>
                ))}
              </div>
              <div className="flex max-w-lg focus-within: button-engrav">
                <button
                  type="button"
                  className={cn(
                    'p-2 text-l leading-none border border-gray-100 text-black dark:text-black transition hover:text-black hover:bg-gray-200 dark:hover:bg-black flex-1'
                  )}
                  onClick={clearText}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className={cn(
                    'p-2 text-l leading-none border border-gray-100 transition text-black dark:text-black hover:text-black hover:bg-gray-200 flex-1'
                  )}
                  onClick={removeCharacter}
                >
                  {translate('label.product.productPersonalisation.backspaceText')}
                </button>
              </div>
              {showError && (
                <p className="mt-2 -mb-2 text-xs text-red-500 underline">
                  {SELECT_IMAGE_ERROR}
                </p>
              )}
              <div className="flex items-center justify-center w-full mt-5 engrav-add-btn">
                <button
                  disabled={text.length == 0 && !selectedImage ? true : false}
                  type="submit"
                  onClick={handleSubmit}
                  className={cn(
                    'flex-1 capitalize bg-black border border-transparent rounded-sm py-3 px-8 flex items-center justify-center font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue sm:w-full',
                    !selectedImage && text.length == 0
                      ? 'opacity-30'
                      : 'hover:opacity-75'
                  )}
                >
                  {submitText}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
