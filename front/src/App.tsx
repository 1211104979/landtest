// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import About from './pages/about';
import Service from './pages/service';
import Login from './pages/login';
import Register from './pages/register';
import UsTransactions from './pages/user/transaction';
import UsProperties from './pages/user/property';
import RegisterLandPage from './pages/user/registerLand';
import Test from './pages/user/test';

// AuthProvider をインポート
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar userRole="user" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/user/properties" element={<UsProperties />} />
        <Route path="/user/transactions" element={<UsTransactions />} />
        <Route path="/user/register-land" element={<RegisterLandPage />} />
        <Route path="/user/test" element={<Test />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
