import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useProductStore } from '../store/productStore';
import { useCustomerStore } from '../store/customerStore';

interface CartItem {
  productId: string;
  productName: string;
  productCode: string;
  price: number;
  quantity: number;
}

const Sales: React.FC = () => {
  const { products, setProducts } = useProductStore();
  const { customers, setCustomers } = useCustomerStore();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoiceCode, setInvoiceCode] = useState<string>('');
  const [searchProduct, setSearchProduct] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const fetchInitialData = async () => {
    try {
      const productsResponse = await axiosClient.get('/products');
      setProducts(productsResponse.data.data);
      const customersResponse = await axiosClient.get('/customers');
      setCustomers(customersResponse.data.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddProductToCart = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (product && quantity > 0) {
      if (product.stock < quantity) {
        alert(`Không đủ hàng cho ${product.name}. Tồn kho: ${product.stock}`);
        return;
      }

      const existingItemIndex = cart.findIndex(item => item.productId === product.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { 
          productId: product.id, 
          productName: product.name, 
          productCode: product.code,
          price: product.price, 
          quantity 
        }]);
      }
      setSelectedProductId('');
      setQuantity(1);
      setSearchProduct('');
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert(`Không đủ hàng. Tồn kho: ${product.stock}`);
      return;
    }
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateChange = () => {
    return paymentAmount - calculateTotal();
  };

  const handleCreateInvoice = async () => {
    if (!selectedCustomer || cart.length === 0 || !invoiceCode) {
      alert('Vui lòng chọn khách hàng, thêm sản phẩm vào giỏ hàng và nhập mã hóa đơn.');
      return;
    }

    try {
      const invoiceItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const response = await axiosClient.post('/invoices', {
        invoiceCode,
        customerId: selectedCustomer,
        items: invoiceItems,
      });
      console.log('Invoice created:', response.data);
      alert('Tạo hóa đơn thành công!');
      setCart([]);
      setInvoiceCode('');
      setSelectedCustomer('');
      setPaymentAmount(0);
      fetchInitialData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Tạo hóa đơn thất bại.');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.code.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const selectedCustomerInfo = customers.find(c => c.id === selectedCustomer);
  const total = calculateTotal();
  const change = calculateChange();

  return (
    <div className="flex h-full gap-6">
      {/* Left Side - Product Selection */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Bán hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo hóa đơn bán hàng mới</p>
        </div>

        {/* Product Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc mã (F3)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
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

        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn sản phẩm</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {filteredProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.code} - {product.name} (Tồn: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-2">SL</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddProductToCart}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Giỏ hàng ({cart.length} sản phẩm)</h2>
          </div>
          
          <div className="flex-1 overflow-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm">Chưa có sản phẩm nào trong giỏ hàng</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.productId} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                        <p className="text-xs text-gray-500">{item.productCode}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {item.price.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-bold text-gray-900 w-24 text-right">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Invoice Details */}
      <div className="w-96 flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hóa đơn</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã hóa đơn</label>
              <input
                type="text"
                value={invoiceCode}
                onChange={(e) => setInvoiceCode(e.target.value)}
                placeholder="Nhập mã hóa đơn"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khách hàng</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customerCode} - {customer.fullName}
                  </option>
                ))}
              </select>
            </div>

            {selectedCustomerInfo && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center text-sm text-gray-700 mb-1">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {selectedCustomerInfo.phone || 'Chưa có SĐT'}
                </div>
                {selectedCustomerInfo.address && (
                  <div className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedCustomerInfo.address}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng tiền hàng:</span>
              <span className="font-medium text-gray-900">{total.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-medium text-gray-900">0 đ</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between mb-2">
                <span className="text-base font-semibold text-gray-900">Khách cần trả:</span>
                <span className="text-xl font-bold text-blue-600">{total.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiền khách đưa</label>
            <input
              type="number"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {paymentAmount > 0 && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Tiền thừa trả khách:</span>
                <span className="text-lg font-bold text-green-600">
                  {change > 0 ? change.toLocaleString('vi-VN') : 0} đ
                </span>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-2">
            <button
              onClick={handleCreateInvoice}
              disabled={cart.length === 0 || !selectedCustomer || !invoiceCode}
              className="w-full py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hoàn thành (F9)
              </div>
            </button>
            <button
              onClick={() => {
                setCart([]);
                setSelectedCustomer('');
                setInvoiceCode('');
                setPaymentAmount(0);
              }}
              className="w-full py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;