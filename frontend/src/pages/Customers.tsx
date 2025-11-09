import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Customer } from '../types/customer';
import { useCustomerStore } from '../store/customerStore';
import CustomerForm from '../components/Customer/CustomerForm';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Customers: React.FC = () => {
  const { customers, setCustomers } = useCustomerStore();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | undefined>(undefined);

  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get('/customers');
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = () => {
    setCurrentCustomer(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axiosClient.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Customers</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={handleCreateCustomer} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md">Add Customer</button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {customers.map((customer, index) => (
              <tr key={customer.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                <td className="py-3 px-6 text-left whitespace-nowrap">{customer.customerCode}</td>
                <td className="py-3 px-6 text-left">{customer.fullName}</td>
                <td className="py-3 px-6 text-left">{customer.phone}</td>
                <td className="py-3 px-6 text-left">{customer.email}</td>
                <td className="py-3 px-6 text-left">{customer.address}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button onClick={() => handleEditCustomer(customer)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-200 mr-2">Edit</button>
                    <button onClick={() => handleDeleteCustomer(customer.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-200">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerForm
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        onSave={fetchCustomers}
        currentCustomer={currentCustomer}
      />
    </div>
  );
};

export default Customers;
