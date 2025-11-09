import React, { useState } from 'react';
import Modal from 'react-modal';
import axiosClient from '../../api/axiosClient';

interface ProductImportExportProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onComplete: () => void;
  type: 'import' | 'export';
}

interface ProductOperationItem {
  code: string;
  quantity: number;
}

const ProductImportExport: React.FC<ProductImportExportProps> = ({ isOpen, onRequestClose, onComplete, type }) => {
  const [items, setItems] = useState<ProductOperationItem[]>([{ code: '', quantity: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { code: '', quantity: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_: ProductOperationItem, i: number) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index: number, field: keyof ProductOperationItem, value: string | number) => {
    const newItems = items.map((item: ProductOperationItem, i: number) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'import') {
        await axiosClient.post('/products/import', items.map((item: ProductOperationItem) => ({ code: item.code, stock: item.quantity })));
      } else {
        await axiosClient.post('/products/export', items);
      }
      onComplete();
      onRequestClose();
    } catch (error) {
      console.error(`Error ${type}ing products:`, error);
      alert(`Failed to ${type} products. Check console for details.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 bg-white rounded-lg shadow-xl p-6 m-auto max-w-lg h-fit"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{type === 'import' ? 'Import Products' : 'Export Products'}</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Product Code"
              value={item.code}
              onChange={(e) => handleChange(index, 'code', e.target.value)}
              className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
              min="1"
              className="mt-1 block w-1/4 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
            <button type="button" onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200">Remove</button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 mb-4 shadow-sm">Add Item</button>
        <div className="flex justify-end space-x-2 mt-6">
          <button type="button" onClick={onRequestClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">{type === 'import' ? 'Import' : 'Export'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductImportExport;
