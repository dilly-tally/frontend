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
  const [userLoginId, setUserLoginId] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          const resp = await axios.post("https://backend-164859304804.us-central1.run.app/v1/auth/login", {
            name: user.displayName,
            firebaseUID: user.uid,
          })
          let backendId =
            resp?.data?.user?.id ?? resp?.data?.userLogin?.id ?? resp?.data?.data?.id ?? resp?.data?.id ?? null

          // Fallback: fetch by firebaseUID using existing route /v1/auth/user-info?firebaseUID=...
          if (!backendId) {
            try {
              const getResp = await axios.get(`https://backend-164859304804.us-central1.run.app/v1/auth/user-info`, {
                params: { firebaseUID: user.uid },
              })
              backendId =
                getResp?.data?.user?.id ??
                getResp?.data?.userLogin?.id ??
                getResp?.data?.data?.id ??
                getResp?.data?.id ??
                null
            } catch (e) {
              // console.log("[v0] fallback user-by-firebase failed", e)
            }
          }

          if (backendId) {
            setUserLoginId(backendId)
            try {
              localStorage.setItem("userLoginId", String(backendId))
            } catch {}
          } else {
            try {
              const cached = localStorage.getItem("userLoginId")
              if (cached) setUserLoginId(Number.parseInt(cached, 10))
            } catch {}
          }
        } catch (error) {
          console.error("Error tracking user login:", error)
          try {
            const cached = localStorage.getItem("userLoginId")
            if (cached) setUserLoginId(Number.parseInt(cached, 10))
          } catch {}
        }
      } else {
        try {
          localStorage.removeItem("userLoginId")
        } catch {}
        setUserLoginId(null)
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
    userLoginId,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
