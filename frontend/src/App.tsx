import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Privacy from './Pages/Privacy'
import Terms from './Pages/Terms'
import Dashboard from './Pages/Dashboard'
import ProtectedRoutes from './Components/Routes/ProtectedRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/*" element={
          <ProtectedRoutes>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
