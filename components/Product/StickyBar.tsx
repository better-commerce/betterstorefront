import React from 'react';
import dynamic from "next/dynamic";
import { useTranslation } from "@commerce/utils/use-translation";

const Button = dynamic(() => import('@components/ui/IndigoButton'))

interface StickyBarProps {
  name: string;
  sellPrice: string;
  wasPrice?: string;
  effectivePrice?: string;
  onAddToBasket: () => void;
  isEngravingAvailable?: boolean;
  product?: any;
  buttonConfig?: any;
  showEngravingModal?: (show: boolean) => void;
  isMobile?: boolean;
}

const StickyBar: React.FC<StickyBarProps> = ({ 
  name, 
  sellPrice, 
  wasPrice, 
  effectivePrice, 
  onAddToBasket,
  isEngravingAvailable = false,
  product,
  buttonConfig,
  showEngravingModal,
  isMobile = false
}) => {
  const translate = useTranslation();

  return (
    <div className="fixed top-[141px] left-0 right-0 z-[9] top-sticky-wrapper bg-white/95 backdrop-blur-md shadow-xl px-6 py-3 border-b border-gray-100 transition-all duration-300">
      <div className='container flex items-center justify-between'>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
        <div className="font-semibold text-base md:text-lg md:max-w-xs text-gray-900">{name}</div>
        <div className=''>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-600 drop-shadow-sm">{sellPrice}</span>
          {wasPrice && wasPrice !== sellPrice && (
            <span className="text-lg text-gray-400">Was <span className='line-through'>{wasPrice}</span></span>
          )}
        </div>
        <div className='effective-price'>
          {effectivePrice && (
            <div className="text-sm font-semibold text-red-700">Effective Price: {effectivePrice}</div>
          )}
        </div>
        </div>
      </div>
      
      {/* Add to Cart Button Section with same logic as main view */}
      <div className="flex w-auto rtl:space-x-reverse blue-add-btn">
        {!isEngravingAvailable && product?.condition != 'pre-launch' && (
          <div className="flex !text-sm w-full add-green-btn">
            <Button title={buttonConfig?.title || "Add to basket"} action={onAddToBasket} buttonType={buttonConfig?.type || 'cart'} />
          </div>
        )}

        {isEngravingAvailable && product?.condition != 'pre-launch' && (
          <>
            <div className='flex flex-col w-full gap-y-2 add-green-btn'>
              <Button className="block py-3 sm:hidden add-green-btn nc-button" title={buttonConfig?.title || "Add to basket"} action={onAddToBasket} buttonType={buttonConfig?.type || 'cart'} />
              <Button className="hidden sm:block" title={buttonConfig?.title || "Add to basket"} action={onAddToBasket} buttonType={buttonConfig?.type || 'cart'} />
              <button 
                className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white bg-gray-700 border border-transparent rounded-full hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full" 
                onClick={() => showEngravingModal?.(true)} 
              >
                {translate('label.product.engravingText')}
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default StickyBar; 