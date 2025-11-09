import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import InventoryCheck from './pages/InventoryCheck'; // Import InventoryCheck
import Login from './pages/Login';
import Register from './pages/Register'; // Import the Register component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add the Register route */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/inventory-check" element={<InventoryCheck />} /> {/* Add InventoryCheck route */}
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;