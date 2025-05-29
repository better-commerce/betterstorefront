import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Cut {
  length: number;
  quantity: number;
}

interface CutBeltModalProps {
  isOpen: boolean;
  onClose: () => void;
  size: number;
  productId: string;
  onSave: (cuts: Cut[]) => void;
}

interface CutRow {
  length: string;
  quantity: string;
}

const CutBeltModal: React.FC<CutBeltModalProps> = ({ isOpen, onClose, onSave, productId }) => {
  const [rows, setRows] = useState<CutRow[]>([{ length: '', quantity: '' }]);
  const [error, setError] = useState<string | null>(null);

  // Load saved values when modal opens
  useEffect(() => {
    if (!isOpen || !productId) return;

    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem('cutBeltData');
        if (!savedData) return;

        const parsedData = JSON.parse(savedData);
        if (!Array.isArray(parsedData)) {
          console.error('Invalid data format in localStorage');
          localStorage.removeItem('cutBeltData');
          return;
        }

        const productData = parsedData.find((item: any) => item?.productId === productId);
        if (!productData?.cuts || !Array.isArray(productData.cuts)) {
          setRows([{ length: '', quantity: '' }]);
          return;
        }

        // Validate each cut has valid length and quantity
        const validCuts = productData.cuts.every((cut: any) => 
          typeof cut?.length === 'number' && 
          typeof cut?.quantity === 'number' &&
          cut.length > 0 &&
          cut.quantity > 0
        );

        if (!validCuts) {
          console.error('Invalid cut data format');
          setRows([{ length: '', quantity: '' }]);
          return;
        }

        setRows(productData.cuts.map((cut: Cut) => ({
          length: String(cut.length),
          quantity: String(cut.quantity)
        })));
      } catch (error) {
        console.error('Error loading saved data:', error);
        setRows([{ length: '', quantity: '' }]);
      }
    };

    loadSavedData();
  }, [isOpen, productId]);

  const validateInputs = (currentRows: CutRow[]): boolean => {
    if (!Array.isArray(currentRows)) return false;

    return currentRows.every(row => {
      const length = Number(row?.length);
      const quantity = Number(row?.quantity);
      return !isNaN(length) && !isNaN(quantity) && length > 0 && quantity > 0;
    });
  };

  const handleAddRow = () => {
    if (!Array.isArray(rows)) {
      setRows([{ length: '', quantity: '' }]);
      return;
    }
    setRows([...rows, { length: '', quantity: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    if (!Array.isArray(rows) || rows.length <= 1 || index < 0 || index >= rows.length) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index: number, field: keyof CutRow, value: string) => {
    if (!Array.isArray(rows) || index < 0 || index >= rows.length) return;

    const sanitizedValue = value.replace(/[^0-9]/g, '');
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: sanitizedValue
    };
    setRows(newRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!Array.isArray(rows)) {
      setError('Invalid row data');
      return;
    }

    const validRows = rows.filter(row => row?.length && row?.quantity);
    if (validRows.length === 0) {
      setError('No valid cuts provided');
      return;
    }

    if (!validateInputs(validRows)) {
      setError('Invalid length or quantity values');
      return;
    }

    const cuts: Cut[] = validRows.map(row => ({
      length: Number(row.length),
      quantity: Number(row.quantity)
    }));

    try {
      onSave(cuts);
      onClose();
    } catch (error) {
      console.error('Error saving cuts:', error);
      setError('Failed to save cuts');
    }
  };

  const isValid = Array.isArray(rows) && rows.some(row => row?.length && row?.quantity);

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Cut Belt
                </Dialog.Title>

                {error && (
                  <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    {Array.isArray(rows) && rows.map((row, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <label htmlFor={`length-${productId}-${index}`} className="block mb-1 text-sm">
                            Length (cm)
                          </label>
                          <input
                            id={`length-${productId}-${index}`}
                            type="text"
                            value={row?.length ?? ''}
                            onChange={(e) => handleRowChange(index, 'length', e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="off"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor={`quantity-${productId}-${index}`} className="block mb-1 text-sm">
                            Quantity
                          </label>
                          <input
                            id={`quantity-${productId}-${index}`}
                            type="text"
                            value={row?.quantity ?? ''}
                            onChange={(e) => handleRowChange(index, 'quantity', e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="off"
                          />
                        </div>
                        {Array.isArray(rows) && rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="mt-6 p-2 text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Another Cut
                    </button>
                  </div>

                  <div className="flex justify-start gap-2 mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm btn btn-secondary"
                      disabled={!isValid}
                    >
                      Save All Cuts
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CutBeltModal; 