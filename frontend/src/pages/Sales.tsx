
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useProductStore } from '../store/productStore';
import { useCustomerStore } from '../store/customerStore';

interface CartItem {
  productId: string;
  productName: string;
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
        alert(`Not enough stock for ${product.name}. Available: ${product.stock}`);
        return;
      }

      const existingItemIndex = cart.findIndex(item => item.productId === product.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { productId: product.id, productName: product.name, price: product.price, quantity }]);
      }
      setSelectedProductId('');
      setQuantity(1);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCreateInvoice = async () => {
    if (!selectedCustomer || cart.length === 0 || !invoiceCode) {
      alert('Please select a customer, add products to cart, and provide an invoice code.');
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
      alert('Invoice created successfully!');
      setCart([]);
      setInvoiceCode('');
      setSelectedCustomer('');
      fetchInitialData(); // Refresh product stock
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Sales / Create Invoice</h1>

      <div className="mb-4">
        <label htmlFor="invoiceCode" className="block text-sm font-medium text-gray-700 mb-1">Invoice Code</label>
        <input
          type="text"
          id="invoiceCode"
          value={invoiceCode}
          onChange={(e) => setInvoiceCode(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
        <select
          id="customer"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        >
          <option value="">-- Select Customer --</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.fullName} ({customer.customerCode})</option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex space-x-4 items-end">
        <div className="flex-1">
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
          <select
            id="product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">-- Select Product --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name} ({product.code}) - Stock: {product.stock}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
            className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleAddProductToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Add to Cart
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2 text-gray-800">Cart</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {cart.map((item, index) => (
              <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.productName}</td>
                <td className="py-3 px-6 text-left">{item.quantity}</td>
                <td className="py-3 px-6 text-left">{item.price}</td>
                <td className="py-3 px-6 text-left">{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 text-gray-800 text-md font-bold">
              <td colSpan={3} className="py-3 px-6 text-right">Total:</td>
              <td className="py-3 px-6 text-left">{calculateTotal().toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button
        onClick={handleCreateInvoice}
        className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-600 transition-colors duration-200 shadow-md mr-2"
      >
        Create Invoice
      </button>
      {/* Example of how to use print invoice (you'd get the invoice ID after creation) */}
      {/* <button
        onClick={() => handlePrintInvoice('some-invoice-id')}
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg"
      >
        Print Last Invoice
      </button> */}
    </div>
  );
};

export default Sales;
