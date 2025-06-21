import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
    id: string
    email: string
    name: string
    image?: string | null
    displayName?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const getBackendUrl = () => {
        return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    }

    useEffect(() => {
    // Check for existing session
        const checkSession = async () => {
            try {
                const backendUrl = getBackendUrl()
                const response = await fetch(`${backendUrl}/api/auth/session`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
                })
                
                if (response.ok) {
                const data = await response.json()
                if (data.data?.user) {
                    setUser(data.data.user)
                }
                }
            } catch (error) {
                console.error('Session check failed:', error)
            } finally {
                setLoading(false)
            }
        }

    checkSession()
    }, [])

    const signIn = async () => {
        try {
            const backendUrl = getBackendUrl()
            const response = await fetch(`${backendUrl}/api/auth/sign-in/social`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider: 'google',
                    callbackURL: '/chats'
                }),
                credentials: 'include'
            })
            
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Sign in failed:', error)
        }
    }

    const signOut = async () => {
        try {
            const backendUrl = getBackendUrl()
            await fetch(`${backendUrl}/api/auth/sign-out`, {
                method: 'POST',
                credentials: 'include'
            })
            setUser(null)
        } catch (error) {
            console.error('Sign out failed:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}