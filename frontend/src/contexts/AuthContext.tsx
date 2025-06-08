import React, { createContext, useContext, useState, useEffect } from 'react'

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for existing session
        fetch('http://localhost:3000/api/auth/session', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.data?.user) {
                setUser(data.data.user)
            }
            setLoading(false)
        })
        .catch(error => {
            console.error('Session check failed:', error)
            setLoading(false)
        })
    }, [])

    const signIn = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/sign-in/social', {
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
            await fetch('http://localhost:3000/api/auth/sign-out', {
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