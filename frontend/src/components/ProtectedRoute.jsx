import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MarketplaceLanding from './pages/landing'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { HomePage } from './pages/home'
import { SellPage } from './pages/sell'
import { BuyerPage } from './pages/buyer'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MarketplaceLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sell" 
          element={
            <ProtectedRoute>
              <SellPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/buyer" 
          element={
            <ProtectedRoute>
              <BuyerPage />
            </ProtectedRoute>
          } 
        />

        {/* 404 Not Found Route */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  )
}

export default App
