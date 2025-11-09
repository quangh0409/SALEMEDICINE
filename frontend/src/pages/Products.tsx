
import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Product } from '../types/product';
import { useProductStore } from '../store/productStore';
import ProductForm from '../components/Product/ProductForm';
import ProductImportExport from '../components/Product/ProductImportExport';
import Modal from 'react-modal'; // Import Modal

// Set app element for react-modal
Modal.setAppElement('#root'); // Assuming your root element has id 'root'

const Products: React.FC = () => {
  const { products, setProducts } = useProductStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [importExportType, setImportExportType] = useState<'import' | 'export'>('import');

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    setCurrentProduct(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleImportProducts = () => {
    setImportExportType('import');
    setIsImportExportModalOpen(true);
  };

  const handleExportProducts = () => {
    setImportExportType('export');
    setIsImportExportModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Products</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={handleCreateProduct} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">Add Product</button>
        <button onClick={handleImportProducts} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">Import Products</button>
        <button onClick={handleExportProducts} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">Export Products</button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Unit</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-left">Warning Threshold</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map((product, index) => (
              <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">{product.code}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">{product.price}</td>
                <td className="py-3 px-6 text-left">{product.unit}</td>
                <td className="py-3 px-6 text-left">{product.stock}</td>
                <td className="py-3 px-6 text-left">{product.warningThreshold}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-200 mr-2">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-200">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductForm
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        onSave={fetchProducts}
        currentProduct={currentProduct}
      />

      <ProductImportExport
        isOpen={isImportExportModalOpen}
        onRequestClose={() => setIsImportExportModalOpen(false)}
        onComplete={fetchProducts}
        type={importExportType}
      />
    </div>
  );
};

export default Products;
