import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import RecentListings from './components/RecentListings';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ProfilePage from './pages/ProfilePage';
import PostListingPage from './pages/PostListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentPage from './pages/PaymentPage';
import MessagesPage from './pages/MessagesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CategoriesPage from './pages/CategoriesPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <RecentListings />
      </main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/post-listing" element={<ProtectedRoute><PostListingPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

