import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Support from './pages/Support';
import Basket from './pages/Basket';
import { BasketProvider } from './context/BasketContext';
import Profile from './components/Profile';
import ContactForm from './pages/ContactForm';
import AuthWrapper from './pages/AuthWrapper';

const App = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <BasketProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/order" element={<Order />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<ContactForm />} />
          
          {/* Auth routes */}
          <Route 
            path="/authwrapper" 
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <AuthWrapper />
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile />
              ) : (
                <Navigate to="/authwrapper" />
              )
            }
          />
        </Routes>
      </Router>
    </BasketProvider>
  );
};

export default App;
