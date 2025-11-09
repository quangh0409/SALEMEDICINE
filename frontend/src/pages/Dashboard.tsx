
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Sales */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Sales (Today)</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">$1,234.56</h2>
          </div>
          <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 6m-2 5a7 7 0 11-14 0h14z" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Products */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Products</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">150</h2>
          </div>
          <div className="bg-green-100 text-green-600 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>

        {/* Card 3: Low Stock Items */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">5</h2>
          </div>
          <div className="bg-red-100 text-red-600 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <p className="mt-8 text-gray-600">Welcome to the SaleMedicine POS Dashboard! Here you can get a quick overview of your sales and inventory.</p>
    </div>
  );
};

export default Dashboard;
