
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const mainNavItems = [
    { path: '/', name: 'Tổng quan' },
    { path: '/products', name: 'Hàng hóa' },
    { path: '/inventory-check', name: 'Kiểm kho' }, // New Inventory Check page
    { path: '/sales', name: 'Giao dịch' },
    { path: '/customers', name: 'Đối tác' },
    { path: '/reports', name: 'Sổ quỹ' }, // Placeholder for a new reports page
    { path: '/settings', name: 'Báo cáo' }, // Placeholder for a new settings page
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-blue-500 text-white p-3 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="text-xl font-bold mr-6">KiotViet</div>
          <nav>
            <ul className="flex space-x-6">
              {mainNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm font-medium pb-1 border-b-2 ${
                      location.pathname === item.path ? 'border-white' : 'border-transparent hover:border-gray-200'
                    } transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">admin</span>
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
