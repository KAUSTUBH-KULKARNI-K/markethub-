import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MarketplaceLanding from './pages/landing'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { HomePage } from './pages/home'
import { SellPage } from './pages/sell'
import { BuyerPage } from './pages/buyer'
import { MyListingsPage } from './pages/MyListings'
import { MessagesPage } from './pages/Messages'
import { ConversationsListPage } from './pages/ConversationsList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketplaceLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/buyer" element={<BuyerPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
        <Route path="/conversations/:productId" element={<ConversationsListPage />} />
        <Route path="/messages/:productId" element={<MessagesPage />} />
      </Routes>
    </Router>
  )
}

export default App
