import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import Privacy from './Components/Privacy'
import Terms from './Components/Terms'
import Dashboard from './Components/Dashboard'
import ProtectedRoutes from './Components/ProtectedRoutes'

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
