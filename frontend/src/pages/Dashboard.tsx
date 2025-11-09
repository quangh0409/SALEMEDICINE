import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi hoạt động kinh doanh của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Sales Today */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,234,560 đ</h3>
          <p className="text-sm text-gray-500">Doanh thu hôm nay</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">150</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">150</h3>
          <p className="text-sm text-gray-500">Tổng sản phẩm</p>
        </div>

        {/* Orders Today */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">+8</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">24</h3>
          <p className="text-sm text-gray-500">Đơn hàng hôm nay</p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">Cảnh báo</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
          <p className="text-sm text-gray-500">Hàng sắp hết</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 'HD001', customer: 'Nguyễn Văn A', amount: '450,000', time: '10 phút trước', status: 'Hoàn thành' },
                { id: 'HD002', customer: 'Trần Thị B', amount: '230,000', time: '25 phút trước', status: 'Hoàn thành' },
                { id: 'HD003', customer: 'Lê Văn C', amount: '890,000', time: '1 giờ trước', status: 'Đang xử lý' },
                { id: 'HD004', customer: 'Phạm Thị D', amount: '120,000', time: '2 giờ trước', status: 'Hoàn thành' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.id} - {order.customer}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{order.amount} đ</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Hoàn thành' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả giao dịch →
            </button>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Tạo đơn hàng mới</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Thêm sản phẩm</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Kiểm kho</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-red-900">Cảnh báo tồn kho</h3>
            </div>
            <p className="text-sm text-red-800 mb-3">Có 5 sản phẩm sắp hết hàng</p>
            <button className="text-sm text-red-700 font-medium hover:text-red-800">
              Xem chi tiết →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;