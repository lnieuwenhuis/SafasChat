import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Replace this with your actual authentication logic
    const isAuthenticated = false // This should come from your auth context/state
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    return <>{children}</>
}

export default ProtectedRoute