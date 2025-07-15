"use client"

import { useState, useEffect } from "react"
import { Box, Button, AppBar, Toolbar } from "@mui/material"
import { useNavigate } from "react-router-dom"
import TypingBannerInHeader from "./TypingBannerInHeader"
import { useAuth } from "../../context/AuthContext"

const ScrollHeader = ({ onLoginClick, onSignUpClick }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(25px)",
        color: "#333",
        boxShadow: "0 1px 10px rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(76, 175, 80, 0.08)",
        height: "70px",
        zIndex: 1100,
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Toolbar sx={{ minHeight: "70px !important", py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50px",
              width: "120px",
              overflow: "hidden",
              mr: 2,
            }}
          >
            <img
              src="/images/logo.png"
              alt="Dilly Tally Logo"
              style={{
                filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.1))",
                maxHeight: "45px",
                maxWidth: "115px",
                height: "auto",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: { xs: "block", sm: "block" } }}>
            <TypingBannerInHeader />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {user ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#4CAF50",
                px: 2.5,
                py: 0.8,
                fontWeight: "600",
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "0.9rem",
                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
                "&:hover": {
                  backgroundColor: "#45a049",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.35)",
                },
                transition: "all 0.25s ease",
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={onLoginClick}
                sx={{
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  px: 2.5,
                  py: 0.8,
                  fontWeight: "600",
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                    color: "white",
                    transform: "translateY(-1px)",
                    boxShadow: "0 3px 10px rgba(76, 175, 80, 0.25)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={onSignUpClick}
                sx={{
                  backgroundColor: "#4CAF50",
                  px: 2.5,
                  py: 0.8,
                  fontWeight: "600",
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.25)",
                  "&:hover": {
                    backgroundColor: "#45a049",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.35)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default ScrollHeader
