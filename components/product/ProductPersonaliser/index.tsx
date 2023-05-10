import cn from 'classnames';
import { ChangeEvent, FC, MouseEventHandler, useCallback, useEffect, useState, useRef } from 'react';
import { Select } from '../../common/Select';
import { Canvas } from '../Canvas';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SwiperCore, { Navigation } from 'swiper'
import { SELECT_IMAGE_ERROR } from '@components/utils/textVariables';
type ProductPersonaliserOption = { label: string; value: string };

type ProductPersonaliserImage = {
  url: string;
  position: string;
  coordinates: string;
  fontSize: number;
};

type ProductPersonaliserProps = {
  images: ProductPersonaliserImage[];
  canvasWidth: number;
  canvasHeight: number;
  characters: string;
  maxTextLength: number;
  submitText: any;
  onSubmit: ({
    message,
    imageUrl,
  }: {
    message: string,
    imageUrl: string,
  }) => void;
  readOnly: false;
  values?: any;
  product: any,
};

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
}: ProductPersonaliserProps) => {
  const [text, setText] = useState<any>([]);
  const [isImageCLick, setIsImageCLick] = useState<any>(false)
  const [selectedImage, setSelectedImage] = useState<any>('')
  const [counter,setCounter] = useState<any>(0);
  const [imageUrl, setImageUrl] = useState<any>('');
  const [showError, setShowError] = useState<any>(false);
  const [isFocus, setIsFocus] = useState<any>(false);
  const [characterClicked, setCharacterClicked] = useState<any>('');

  useEffect(() => {
    if(readOnly){
          product.children?.map((val:any, key:number) => {
            setText(val.customInfo1 || 'SAMPLE')
            setImageUrl(val.customInfo2 || val.image )
          }
        )
    }
  }, [])

  let prodpersonaliserURL:any = '';
  prodpersonaliserURL = product.image ? product.image : '';

  const maxTextLengthReached = counter >= maxTextLength;

  const addCharacter = useCallback(
      (character: string) => {
          
      setIsFocus(true)
      const newText = `${text}${character}`;

      if (maxTextLengthReached) {
        throw new Error('Text exceeds the max characters.');
      }

      setText(newText);
    },
    [text, maxTextLengthReached],
  );

  function addCharacterFromInput(e:any){
    setIsFocus(true)
    const newTextFromIp = e.target.value
    newTextFromIp.toUpperCase();
    // const newText = `${text}${newTextFromIp}`
    if(counter < 7){
        setText(newTextFromIp)
    }
  }

  const removeCharacter = useCallback(() => {
    if(text.length>0){
      const chars = text.split('');
      let re = new RegExp(/^[A-Z0-9]+$/i)
      if(re.test(text[text.length-1])){
        chars.pop();
        setCounter(counter-1)
      }else{
        chars.pop();
        chars.pop();
        setCounter(counter-1)
      }
      
      setText(chars.join(''));
    }
  }, [text]);

  const clearText = useCallback(() => {
    setIsFocus(false)
    setCounter(0)
    setText('');
  }, []);

  const handleSubmit = useCallback(() => {
    if( !selectedImage && product.images?.length > 1){
        setShowError(true)
        return;
    }
    onSubmit({
      message: text,
      imageUrl: product?.images?.length > 1 ? selectedImage : product.images[0]
    });
  }, [onSubmit, text, selectedImage]); 

  // function to handle selected Image
  function handleImageCLick(e:any){
    setIsImageCLick(true);
    setSelectedImage(e.target.src)
  }

  useEffect(() => {
   if(counter < 7) {setCounter(text.length)}
  },[text])

  useEffect(() => {
    setShowError(false)
  },[selectedImage])

  return (
    <div className="flex flex-col w-full">      
      {readOnly && (
        <>
        <div
        // style={{ minWidth: canvasWidth, minHeight: canvasHeight }}
        className="mb-2 mob-engrav-img iphoneXR:p-1 s20:p-2"
      >
        <img src={imageUrl || ''} width={200} height={180} alt={product.name} className='mx-auto'></img>
      </div>
          <div className="px-4 xsm:p-3 m-auto">
            <p className="mb-3 text-black xsm:text-sm xsm:flex dark:text-black"><span className='text-gray-500 text-2xl'>Message</span> : <span className='text-2xl'>{text}</span></p>
            {/* <p className="mb-3 text-black xsm:text-sm xsm:flex dark:text-black "><span className='text-gray-500 text-ms'>Color</span>: {textColor}</p> */}
          </div>
        </>
      )}
      
      {!readOnly && (
        <>
        <div
            style={{ minWidth: canvasWidth, minHeight: canvasHeight }}
            className="mb-4 mob-engrav-img iphoneXR:p-1 s20:p-2"
        > 
        <div className='flex flex-row'>

            { product?.images?.length > 1 ? (
            <div className='w-96 h-full flex flex-col mx-auto'>
                { !selectedImage ? <p className='my-1 font-thin text-center'>Select the Product you want to personalise</p> : <p className='my-1 font-thin text-center'>Great selection !</p>}
                <Swiper
                  slidesPerView={1.1}
                  navigation={true}
                  loop={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 1.1,
                    },
                    768: {
                      slidesPerView: 1.1,
                    },
                    1024: {
                      slidesPerView: 1.1,
                    },
                  }}
                >
                  {product?.images?.map((val: any, valId: number) => {
                    return (
                      <SwiperSlide className={cn( 
                        'py-0 border border-grey-40',
                        isImageCLick && ''
                      )} 
                      key={valId}
                      >
                        <img src={val.image} alt={val.image} className={cn('max-h-md w-full', !!selectedImage && selectedImage === val.image  && 'border-2 border-blue')} onClick={(e)=> {
                            handleImageCLick(e);
                        }} ></img>
                      </SwiperSlide>
                    )
                  })}
            </Swiper>

            </div>) : 
            (
                <>
                    <img src={product.images[0].image} alt='image1' className='max-h-md w-full'/>
                </>
            )}
        </div>
      </div>

      <div className={cn('pl-2 mb-2 text-gray-500 font-light text-sm rounded-xl h-14',
                          isFocus ? 'border-2 border-blue' : 'box-border border-2'
                      )}>
      <span className='pl-2 text-gray-500 font-light text-xs'>YOUR ENGRAVING</span>
          <input className='pb-2 w-3/4 block m-auto text-black font-mono shadow-none focus:shadow-outline border-none outline-none focus:outline-none text-center text-sm' onChange={(e)=>{
                  addCharacterFromInput(e)
              }} value={text}>
          </input>
      </div>
          <div className="w-full max-w-full ml-3 pr-6">
          <span className="text-sm text-gray-700 dark:text-gray-700 font-medium">
              {counter} / {maxTextLength} characters
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
                    setCounter(counter+1)
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
                Backspace
              </button>
            </div>
                {showError && <p className='text-red-500 mt-2 -mb-2 underline text-xs'>{SELECT_IMAGE_ERROR}</p>}
            <div className="flex items-center justify-center w-full mt-5 engrav-add-btn">
                {/* { !selectedImageCheck && <p className='text-center font-thin text-red-400'>Please Select an Image of the product first</p>} */}
              <button
                disabled={(text.length == 0 && !selectedImage) ? true : false}
                type="submit"
                onClick={handleSubmit}
               // className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white capitalize transition border border-transparent rounded-sm bg-green hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green sm:w-full"
                className={cn(
                  'flex-1 capitalize bg-black border border-transparent rounded-sm py-3 px-8 flex items-center justify-center font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue sm:w-full',
                  (!selectedImage && text.length == 0 ) ? 'opacity-30' : 'hover:opacity-75'
                )}
              >
                {submitText}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
};