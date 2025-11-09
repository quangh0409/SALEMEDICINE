import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Product } from '../types/product';
import { useProductStore } from '../store/productStore';
import ProductForm from '../components/Product/ProductForm';
import ProductImportExport from '../components/Product/ProductImportExport';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Products: React.FC = () => {
  const { products, setProducts } = useProductStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  const [importExportType, setImportExportType] = useState<'import' | 'export'>('import');
  const [searchTerm, setSearchTerm] = useState('');

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
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await axiosClient.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Xóa sản phẩm thất bại.');
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hàng hóa</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý danh sách sản phẩm của bạn</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCreateProduct} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm hàng hóa
            </button>
            <button 
              onClick={handleImportProducts} 
              className="flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Nhập hàng
            </button>
            <button 
              onClick={handleExportProducts} 
              className="flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Xuất hàng
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá bán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cảnh báo</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Không tìm thấy sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.price.toLocaleString('vi-VN')} đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${product.stock <= product.warningThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.warningThreshold}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)} 
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)} 
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{filteredProducts.length}</span> sản phẩm
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Trước
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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