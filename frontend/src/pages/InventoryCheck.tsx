import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useProductStore } from '../store/productStore';

interface InventoryItem {
  productId: string;
  productCode: string;
  productName: string;
  systemStock: number;
  actualStock: number;
  difference: number;
  valueDifference: number;
  price: number;
  checked: boolean;
}

const InventoryCheck: React.FC = () => {
  const { setProducts } = useProductStore();
  const [activeTab, setActiveTab] = useState<'all' | 'matched' | 'mismatched' | 'unchecked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [checkCode, setCheckCode] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get('/products');
      const productData = response.data.data;
      setProducts(productData);
      
      // Initialize inventory items from products
      const items: InventoryItem[] = productData.map((p: any) => ({
        productId: p.id,
        productCode: p.code,
        productName: p.name,
        systemStock: p.stock,
        actualStock: 0,
        difference: 0,
        valueDifference: 0,
        price: p.price,
        checked: false
      }));
      setInventoryItems(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleActualStockChange = (productId: string, value: number) => {
    setInventoryItems(items =>
      items.map(item => {
        if (item.productId === productId) {
          const difference = value - item.systemStock;
          const valueDifference = difference * item.price;
          return {
            ...item,
            actualStock: value,
            difference,
            valueDifference,
            checked: true
          };
        }
        return item;
      })
    );
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeTab) {
      case 'matched':
        return item.checked && item.difference === 0;
      case 'mismatched':
        return item.checked && item.difference !== 0;
      case 'unchecked':
        return !item.checked;
      default:
        return true;
    }
  });

  const stats = {
    all: inventoryItems.length,
    matched: inventoryItems.filter(i => i.checked && i.difference === 0).length,
    mismatched: inventoryItems.filter(i => i.checked && i.difference !== 0).length,
    unchecked: inventoryItems.filter(i => !i.checked).length,
    totalActual: inventoryItems.reduce((sum, i) => sum + i.actualStock, 0),
    totalDifference: inventoryItems.reduce((sum, i) => sum + i.difference, 0),
    totalValueDifference: inventoryItems.reduce((sum, i) => sum + i.valueDifference, 0)
  };

  const handleSaveDraft = () => {
    alert('Đã lưu phiếu kiểm kho tạm');
  };

  const handleComplete = async () => {
    if (!checkCode) {
      alert('Vui lòng nhập mã phiếu kiểm kho');
      return;
    }
    
    const uncheckedCount = stats.unchecked;
    if (uncheckedCount > 0) {
      const confirm = window.confirm(`Còn ${uncheckedCount} sản phẩm chưa kiểm. Bạn có muốn tiếp tục?`);
      if (!confirm) return;
    }

    alert('Hoàn thành kiểm kho! (Chức năng này cần tích hợp với API)');
  };

  return (
    <div className="flex h-full gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Kiểm kho</h1>
          <p className="text-sm text-gray-500 mt-1">Kiểm tra và cập nhật tồn kho thực tế</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Tổng SL kiểm</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalActual}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">SL lệch</p>
            <p className={`text-2xl font-bold ${stats.totalDifference > 0 ? 'text-green-600' : stats.totalDifference < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.totalDifference > 0 ? '+' : ''}{stats.totalDifference}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Giá trị lệch</p>
            <p className={`text-xl font-bold ${stats.totalValueDifference > 0 ? 'text-green-600' : stats.totalValueDifference < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.totalValueDifference > 0 ? '+' : ''}{stats.totalValueDifference.toLocaleString('vi-VN')} đ
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Tiến độ</p>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((stats.all - stats.unchecked) / stats.all * 100) || 0}%` }}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm font-semibold text-gray-900">
                {Math.round((stats.all - stats.unchecked) / stats.all * 100) || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm hàng hóa theo mã hoặc tên (F3)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả ({stats.all})
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'matched'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('matched')}
            >
              Khớp ({stats.matched})
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'mismatched'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('mismatched')}
            >
              Lệch ({stats.mismatched})
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'unchecked'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('unchecked')}
            >
              Chưa kiểm ({stats.unchecked})
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Mã hàng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase">Tên hàng</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">Tồn kho</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-blue-900 uppercase">Thực tế</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">SL lệch</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900 uppercase">Giá trị lệch</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Không tìm thấy sản phẩm</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.checked ? (
                            item.difference === 0 ? (
                              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            )
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className="text-sm font-medium text-gray-900">{item.productCode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{item.productName}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-gray-900">{item.systemStock}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.actualStock || ''}
                          onChange={(e) => handleActualStockChange(item.productId, parseInt(e.target.value) || 0)}
                          className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${
                          item.difference > 0 ? 'text-green-600' : 
                          item.difference < 0 ? 'text-red-600' : 
                          'text-gray-900'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${
                          item.valueDifference > 0 ? 'text-green-600' : 
                          item.valueDifference < 0 ? 'text-red-600' : 
                          'text-gray-900'
                        }`}>
                          {item.valueDifference > 0 ? '+' : ''}{item.valueDifference.toLocaleString('vi-VN')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {filteredItems.length} sản phẩm
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  Trước
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">admin</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã kiểm kho</label>
              <input
                type="text"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value)}
                placeholder="Nhập mã phiếu"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Trạng thái:</span>
                <p className="font-medium text-blue-600">Phiếu tạm</p>
              </div>
              <div>
                <span className="text-gray-600">Tổng SL thực tế:</span>
                <p className="font-medium text-gray-900">{stats.totalActual}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Thao tác nhanh</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Thêm từ nhóm hàng</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Xuất Excel</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Hoàn thành
          </button>
          <button
            onClick={handleSaveDraft}
            className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu tạm
          </button>
          <button className="w-full py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Trở về
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCheck;