"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../config/firebase"
import axios from "../api/auth"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Track user login in backend
        try {
          await axios.post("https://backend-164859304804.us-central1.run.app/v1/auth/login", {
            name: user.displayName,
            firebaseUID: user.uid,
          })
        } catch (error) {
          console.error("Error tracking user login:", error)
        }
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (user) {
        // Track user logout in backend
        try {
          await axios.post("https://backend-164859304804.us-central1.run.app/v1/auth/logout", {
            firebaseUID: user.uid,
          })
        } catch (error) {
          console.error("Error tracking user logout:", error)
        }
      }

      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
