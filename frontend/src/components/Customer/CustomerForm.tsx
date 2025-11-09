import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosClient from '../../api/axiosClient';
import { Customer } from '../../types/customer';

interface CustomerFormProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSave: () => void;
  currentCustomer?: Customer;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onRequestClose, onSave, currentCustomer }) => {
  const [customerCode, setCustomerCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      setCustomerCode(currentCustomer.customerCode);
      setFullName(currentCustomer.fullName);
      setPhone(currentCustomer.phone ||"");
      setEmail(currentCustomer.email ||"");
      setAddress(currentCustomer.address ||"");
    } else {
      setCustomerCode('');
      setFullName('');
      setPhone('');
      setEmail('');
      setAddress('');
    }
  }, [currentCustomer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerData = { customerCode, fullName, phone, email, address };

    try {
      if (currentCustomer) {
        await axiosClient.put(`/customers/${currentCustomer.id}`, customerData);
      } else {
        await axiosClient.post('/customers', customerData);
      }
      onSave();
      onRequestClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 bg-white rounded-lg shadow-xl p-6 m-auto max-w-lg h-fit"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{currentCustomer ? 'Edit Customer' : 'Create Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Code</label>
          <input type="text" value={customerCode} onChange={(e) => setCustomerCode(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button type="button" onClick={onRequestClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerForm;
