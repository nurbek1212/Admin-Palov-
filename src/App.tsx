import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Support from './pages/Support';
import Basket from './pages/Basket';
import { BasketProvider } from './context/BasketContext';
import Profile from './components/Profile';

const App = () => {
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
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </BasketProvider>
  );
};

export default App;
