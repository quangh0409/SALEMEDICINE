import React, { useState } from 'react';

const InventoryCheck: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'matched', 'mismatched', 'unchecked'
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for the table
  const products = [
    { id: '1', code: 'NUD016', name: 'Thắt lưng nữ màu vàng', stock: 0, actual: '', slLech: '', giaTriLech: '' },
    { id: '2', code: 'NUD015', name: 'Thắt lưng nữ HEX xanh lá', stock: 8, actual: '', slLech: '', giaTriLech: '' },
    { id: '3', code: 'NUD014', name: 'Thắt lưng nữ DKNY màu xanh', stock: 2, actual: '', slLech: '', giaTriLech: '' },
    { id: '4', code: 'NUD013', name: 'Thắt lưng nữ ZAA màu nâu', stock: 0, actual: '', slLech: '', giaTriLech: '' },
    { id: '5', code: 'NUD012', name: 'Giày nữ màu kem', stock: 6, actual: '', slLech: '', giaTriLech: '' },
    { id: '6', code: 'NUD011', name: 'Giày nữ màu xanh bóng', stock: 12, actual: '', slLech: '', giaTriLech: '' },
    { id: '7', code: 'NUD010', name: 'Giày nữ màu trắng', stock: 2, actual: '', slLech: '', giaTriLech: '' },
    { id: '8', code: 'NUD009', name: 'Giày nữ màu đen hồ môi', stock: 0, actual: '', slLech: '', giaTriLech: '' },
    { id: '9', code: 'NUD008', name: 'Túi xách nữ màu xanh dương', stock: 4, actual: '', slLech: '', giaTriLech: '' },
    { id: '10', code: 'NUD007', name: 'Ví màu xanh lá cây', stock: 4, actual: '', slLech: '', giaTriLech: '' },
  ];

  const filteredProducts = products.filter(product =>
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full bg-gray-100">
      {/* Left Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 mr-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Kiểm kho</h2>

        {/* Search Bar */}
        <div className="flex items-center mb-4">
          <div className="relative flex-1 mr-2">
            <input
              type="text"
              placeholder="Tìm hàng hóa theo mã hoặc tên (F3)"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả (12)
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'matched' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('matched')}
          >
            Khớp (0)
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'mismatched' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('mismatched')}
          >
            Lệch (0)
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'unchecked' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('unchecked')}
          >
            Chưa kiểm (12)
          </button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-blue-50 text-blue-700 uppercase text-xs font-semibold">
                <th className="py-3 px-4 text-left">Mã hàng hóa</th>
                <th className="py-3 px-4 text-left">Tên hàng</th>
                <th className="py-3 px-4 text-left">Tồn kho</th>
                <th className="py-3 px-4 text-left">Thực tế</th>
                <th className="py-3 px-4 text-left">SL lệch</th>
                <th className="py-3 px-4 text-left">Giá trị lệch</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                  <td className="py-3 px-4 flex items-center">
                    <span className="text-red-500 mr-2">✕</span> {product.code}
                  </td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    <input type="number" className="w-20 border border-gray-300 rounded-sm p-1 text-center" />
                  </td>
                  <td className="py-3 px-4">{product.slLech}</td>
                  <td className="py-3 px-4">{product.giaTriLech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            <button className="p-2 rounded hover:bg-gray-200">{"<<"}</button>
            <button className="p-2 rounded hover:bg-gray-200">{"<"}</button>
            <button className="p-2 rounded bg-blue-500 text-white mx-1">1</button>
            <button className="p-2 rounded hover:bg-gray-200">2</button>
            <button className="p-2 rounded hover:bg-gray-200">{">"}</button>
            <button className="p-2 rounded hover:bg-gray-200">{">>"}</button>
          </div>
          <span>Hiển thị 1 - 10 trên tổng số 12 mã hàng</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="font-semibold">admin</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">19/05/2017 19:18</div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Mã kiểm kho</span>
            <span className="text-sm font-medium">Mã phiếu tự động</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Trạng thái</span>
            <span className="text-sm font-medium text-blue-600">Phiếu tạm</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Tổng SL thực tế</span>
            <span className="text-sm font-medium">0</span>
          </div>
          <div className="flex items-center mt-2 text-gray-600">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="text-sm">Ghi chú</span>
          </div>
        </div>

        <div className="flex-1 border-t border-gray-200 pt-4">
          <h3 className="font-semibold mb-2 text-gray-800">Kiểm gần đây</h3>
          <div className="flex items-center text-blue-600">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="text-sm">Thêm từ nhóm Phụ kiện Nữ</span>
          </div>
        </div>

        <div className="flex justify-between space-x-2 mt-4">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 flex-1">Trở về</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex-1">Lưu tạm</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex-1">Hoàn thành</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCheck;