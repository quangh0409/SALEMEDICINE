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
      className="modal-content-custom"
      overlayClassName="modal-overlay-custom"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{currentProduct ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 text-sm font-semibold mb-2">Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product code"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-semibold mb-2">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter price"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="unit" className="block text-gray-700 text-sm font-semibold mb-2">Unit</label>
            <input
              type="text"
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter unit"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="warningThreshold" className="block text-gray-700 text-sm font-semibold mb-2">Warning Threshold</label>
            <input
              type="number"
              id="warningThreshold"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value))}
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter warning threshold"
              required
            />
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProductForm;
