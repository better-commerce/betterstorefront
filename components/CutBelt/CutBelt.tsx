import React, { useState, useEffect } from 'react';
import CutBeltModal from './CutBeltModal';
import cartHandler from "@components/services/cart";
import { useUI } from "@components/ui";

interface CutBeltProps {
  size: number;
  productId: string;
  product?: any;
}

interface Cut {
  length: number;
  quantity: number;
}

interface SavedCutData {
  cuts: Cut[];
  productId: string;
}

const CutBelt: React.FC<CutBeltProps> = ({ size, productId, product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedCut, setSavedCut] = useState<SavedCutData | null>(null);
  const { user, basketId, cartItems, setCartItems } = useUI()
  const [isCutAdded, setIsCutAdded] = useState(0);

  useEffect(() => {
    // Load saved cuts from localStorage
    const loadSavedData = () => {
      if (!productId) {
        console.error('Product ID is required');
        return;
      }

      try {
        const savedData = localStorage.getItem('cutBeltData');
        if (!savedData) return;

        const parsedData = JSON.parse(savedData);
        if (!Array.isArray(parsedData)) {
          console.error('Invalid data format in localStorage');
          localStorage.removeItem('cutBeltData');
          return;
        }

        // Find cut for this specific product
        const productCut = parsedData.find((cut: SavedCutData) => 
          cut?.productId === productId && 
          Array.isArray(cut?.cuts) && 
          cut.cuts.every(item => 
            typeof item?.length === 'number' && 
            typeof item?.quantity === 'number'
          )
        );

        setSavedCut(productCut || null);
      } catch (error) {
        console.error('Error loading cut belt data:', error);
        localStorage.removeItem('cutBeltData');
        setSavedCut(null);
      }
    };

    loadSavedData();

    // Add click event listener to the cutbelt button
    const cutBeltButton = document.getElementById(`cutbelt-${productId}`);
    if (cutBeltButton) {
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
      };
      
      cutBeltButton.addEventListener('click', handleClick);

      // Cleanup listener
      return () => {
        cutBeltButton.removeEventListener('click', handleClick);
      };
    }
  }, [productId]); // Only re-run if productId changes

  useEffect(() => {
    const selectedProd = cartItems?.lineItems?.find((item: any) => item.productId === productId)
    setIsCutAdded(selectedProd?.qty);
  },[])

  const handleSaveCut = (cuts: Cut[]) => {
    if (!productId || !Array.isArray(cuts)) {
      console.error('Invalid save data');
      return;
    }

    try {
      const savedData = localStorage.getItem('cutBeltData');
      const allData = savedData ? JSON.parse(savedData) : [];
      
      if (!Array.isArray(allData)) {
        console.error('Invalid data format in localStorage');
        localStorage.removeItem('cutBeltData');
        return;
      }

      // Validate cuts data
      const validCuts = cuts.every(cut => 
        typeof cut?.length === 'number' && 
        typeof cut?.quantity === 'number' &&
        cut.length > 0 &&
        cut.quantity > 0
      );

      if (!validCuts) {
        console.error('Invalid cut data format');
        return;
      }

      // Add productId to the cut data
      const newCutData: SavedCutData = {
        cuts,
        productId
      };

      // Remove old cuts for this product
      const filteredData = allData.filter((cut: SavedCutData) => cut?.productId !== productId);
      
      // Add new cut data
      const updatedData = [...filteredData, newCutData];
      localStorage.setItem('cutBeltData', JSON.stringify(updatedData));
      setSavedCut(newCutData);
    } catch (error) {
      console.error('Error saving cut belt data:', error);
    }
  };

  const getTotalPieces = () => {
    if (!savedCut?.cuts?.length) return 0;
    
    try {
      return savedCut.cuts.reduce((total, cut) => {
        if (typeof cut?.quantity !== 'number') return total;
        return total + cut.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total pieces:', error);
      return 0;
    }
  };

  const getTotalLength = () => {
    if (!savedCut?.cuts?.length) return 0;
    
    try {
      return savedCut.cuts.reduce((total, cut) => {
        if (typeof cut?.length !== 'number' || typeof cut?.quantity !== 'number') return total;
        return total + (cut.length * cut.quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating total length:', error);
      return 0;
    }
  };

  const getUnitsNeeded = () => {
    try {
      const totalLength = getTotalLength();
      return Math.ceil(totalLength / 1000);
    } catch (error) {
      console.error('Error calculating units needed:', error);
      return 0;
    }
  };

  if (!productId) {
    return null;
  }
  const updateQty = async () => {
    const selectedProduct = cartItems?.lineItems?.find((item: any) => item.productId === productId)
    const quantity = getUnitsNeeded() - selectedProduct?.qty;
    const items = await cartHandler()?.addToCart(
          {
            basketId,
            productId: productId,
            qty: quantity,
            // manualUnitPrice: data?.price?.raw?.withoutTax,
            stockCode: product?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { product }
    )
      setCartItems(items)
  }

  const hasSavedCuts = savedCut?.cuts && Array.isArray(savedCut.cuts) && savedCut.cuts.length > 0;

  return (
    <div className="w-full">
      {hasSavedCuts && (
        <div className="p-3 mt-3 text-sm bg-green-100 rounded border border-green-200">
          <div className="text-green-800">
            Cut Summary
          </div>
          <div className="mt-1 text-green-700">
            {savedCut?.cuts?.map((cut, index) => (
              <div key={index}>
                Cut {cut?.quantity || 0} piece(s) of {cut?.length || 0} cm each
              </div>
            ))}
            {(getUnitsNeeded() !== isCutAdded) && 
            <div className="mt-2 pt-2 border-t border-green-200">
              <div>Total: {getTotalPieces()} pieces ({getTotalLength()} cm)</div>
              <div className="text-sm mt-1 text-gray-600">
                {getUnitsNeeded()} units needed
                <button
                  onClick={() => updateQty()}
                  className="ml-3 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Update Quantity
                </button>
              </div>
            </div>}
          </div>
        </div>
      )}

      <CutBeltModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={size}
        productId={productId}
        onSave={handleSaveCut}
      />
    </div>
  );
};

export default CutBelt; 