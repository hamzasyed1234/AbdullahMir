import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminBar from './components/AdminBar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import MeetMir from './pages/MeetMir'
import Priorities from './pages/Priorities'
import Articles from './pages/Articles'
import Press from './pages/Press'
import AdminLogin from './pages/AdminLogin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AdminBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meet-mir" element={<MeetMir />} />
          <Route path="/priorities" element={<Priorities />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/press" element={<Press />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}