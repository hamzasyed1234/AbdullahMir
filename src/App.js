import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminBar from './components/AdminBar'
import ScrollToTop from './components/ScrollToTop'

const Home = lazy(() => import('./pages/Home'))
const MeetMir = lazy(() => import('./pages/MeetMir'))
const Priorities = lazy(() => import('./pages/Priorities'))
const Articles = lazy(() => import('./pages/Articles'))
const Press = lazy(() => import('./pages/Press'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AdminBar />
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meet-mir" element={<MeetMir />} />
            <Route path="/priorities" element={<Priorities />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/press" element={<Press />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}