import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRoutesProps {
    children: ReactNode
}

function ProtectedRoutes({ children }: ProtectedRoutesProps) {
    // Replace this with your actual authentication logic
    const isAuthenticated = true // This should come from your auth context/state
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    
    return <>{children}</>
}

export default ProtectedRoutes