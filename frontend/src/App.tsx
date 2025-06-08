import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Public/Home'
import About from './Pages/Public/About'
import Privacy from './Pages/Public/Privacy'
import Terms from './Pages/Public/Terms'
import Dashboard from './Pages/Protected/Dashboard'
import Chat from './Pages/Protected/Chat'
import NotFound from './Pages/Public/404'
import ProtectedRoutes from './Components/Routes/ProtectedRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/dashboard" element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        } />
        <Route path="/chats" element={
          <ProtectedRoutes>
            <Chat />
          </ProtectedRoutes>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
