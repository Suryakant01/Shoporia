import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    const handleSetToken = (userToken) => {
        localStorage.setItem('token', userToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
    };

    return (
        <ErrorBoundary>
            <CartProvider>

                <Toaster position="top-center" reverseOrder={false} />

                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage setToken={handleSetToken} />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route
                            element={
                                <ProtectedRoute>
                                    <Layout handleLogout={handleLogout} />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/" element={<ShopPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/orders" element={<OrderHistoryPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </ErrorBoundary>
    );
}

export default App;