import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import Dashboard from './Components/Dashboard'
import Profile from './Components/Profile'
import Settings from './Components/Settings'
import ProtectedRoutes from './Components/ProtectedRoutes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/*" element={
          <ProtectedRoutes>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </ProtectedRoutes>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
