import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosClient from '../../api/axiosClient';
import { Product } from '../../types/product';

interface ProductFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
  currentProduct?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onRequestClose, onSave, currentProduct }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState('');
  const [warningThreshold, setWarningThreshold] = useState<number>(10);

  useEffect(() => {
    if (currentProduct) {
      setCode(currentProduct.code);
      setName(currentProduct.name);
      setPrice(currentProduct.price);
      setUnit(currentProduct.unit);
      setWarningThreshold(currentProduct.warningThreshold);
    } else {
      setCode('');
      setName('');
      setPrice(0);
      setUnit('');
      setWarningThreshold(10);
    }
  }, [currentProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { code, name, price, unit, warningThreshold };

    try {
      if (currentProduct) {
        await axiosClient.put(`/products/${currentProduct.id}`, productData);
      } else {
        await axiosClient.post('/products', productData);
      }
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 bg-white rounded-lg shadow-xl p-6 m-auto max-w-lg h-fit"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentProduct ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Warning Threshold</label>
          <input type="number" value={warningThreshold} onChange={(e) => setWarningThreshold(parseInt(e.target.value))} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button type="button" onClick={onRequestClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
